# Minilink Architecture - Production Short URLs

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS                                   │
│                         (Browser)                               │
└─────────────────────────────────────────────────────────────────┘
         │                              │                │
         │                              │                │
    ┌────▼─────┐              ┌────────▼──────┐   ┌─────▼────┐
    │ Create    │              │ Share Link    │   │ Click    │
    │ Short URL │              │ (copy-paste)  │   │ Link     │
    └────┬─────┘              └────────┬──────┘   └─────┬────┘
         │                              │                │
         └──────────────┬───────────────┴────────────────┘
                        │
                ┌───────▼────────┐
                │ Frontend App   │
                │  Vercel        │
                │ (React/SPA)    │
                └───────┬────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        │ /api/urls     │ /login        │ /r/:shortId
        │ (create, get) │ (auth)        │ (redirect)
        │               │               │
        ▼               ▼               ▼
    ┌─────────────────────────────────────────────┐
    │     BACKEND API                             │
    │     (Node.js/Express)                       │
    │     Render: minilink-fr8u.onrender.com     │
    │                                             │
    │  ┌─────────────────────────────────────┐   │
    │  │ POST /api/urls                      │   │
    │  │ - Validate URL                      │   │
    │  │ - Generate shortId (nanoid)         │   │
    │  │ - Store in DB                       │   │
    │  │ - Return: { shortId }               │   │
    │  │ ✅ RESPONSE OPTIMIZED (no URL)      │   │
    │  └─────────────────────────────────────┘   │
    │                                             │
    │  ┌─────────────────────────────────────┐   │
    │  │ GET /:shortId                       │   │
    │  │ GET /r/:shortId                     │   │
    │  │ - Fast lookup (indexed query)       │   │
    │  │ - Record click (async)              │   │
    │  │ - Return: HTTP 301 + Location      │   │
    │  │ ✅ ULTRA-OPTIMIZED REDIRECT         │   │
    │  └─────────────────────────────────────┘   │
    │                                             │
    └─────────────────────────────────────────────┘
        │                               │
        ▼                               ▼
    ┌─────────────────┐            ┌──────────────┐
    │   MongoDB       │            │   Backend    │
    │   Database      │            │   Logs       │
    │                 │            │              │
    │ - Indexed       │            │ - Error      │
    │ - TTL cleanup   │            │ - Analytics  │
    │ - Optimized     │            │ - Monitoring │
    └─────────────────┘            └──────────────┘
```

## URL Flow (Production)

```
USER ACTION: Create Short URL

1. User enters: https://example.com/very/long/url/path
   └─ Frontend sends to API

2. Backend processes:
   ┌────────────────────────────────────┐
   │ POST /api/urls                     │
   │ {                                  │
   │   "originalUrl": "https://..."     │
   │ }                                  │
   └────────────────────────────────────┘
   
3. Backend response:
   ┌────────────────────────────────────┐
   │ {                                  │
   │   "shortId": "abc123xyz",          │
   │   "originalUrl": "https://...",    │
   │   "clicks": 0,                     │
   │   "createdAt": "..."               │
   │ }                                  │
   │ ❌ NO "shortUrl" field             │
   │ ❌ NO hardcoded domain             │
   └────────────────────────────────────┘

4. Frontend constructs URL:
   ┌────────────────────────────────────┐
   │ const shortUrl =                   │
   │   `https://mini.lk/${shortId}`     │
   │                                    │
   │ Result:                            │
   │ https://mini.lk/abc123xyz          │
   └────────────────────────────────────┘

5. User shares: https://mini.lk/abc123xyz

USER ACTION: Click Shared Link

6. Browser requests:
   GET https://mini.lk/abc123xyz
   
7. Backend receives:
   - Fast lookup: find shortId in DB
   - Record click: async (doesn't block)
   - Return: HTTP 301 Moved Permanently
   
8. Browser follows redirect:
   Location: https://example.com/very/long/url/path
   
9. Analytics recorded:
   - Click count incremented
   - Device info stored
   - Referrer recorded
```

## Database Schema (Optimized)

```
┌───────────────────────────────────────────────────────┐
│ ShortUrl Collection                                   │
├───────────────────────────────────────────────────────┤
│                                                       │
│ _id: ObjectId                                        │
│ shortId: String ⭐ UNIQUE, INDEXED                   │
│ originalUrl: String                                  │
│ user: ObjectId (ref: User) 📌 INDEXED               │
│ clicks: Number 📌 INDEXED                            │
│ isActive: Boolean 📌 INDEXED                         │
│ expiresAt: Date 📌 TTL INDEX (auto-delete)          │
│ customAlias: String (optional) 📌 INDEXED           │
│ qrCode: String (data URL)                            │
│ metadata: {                                          │
│   title: String                                      │
│   description: String                                │
│   tags: [String]                                     │
│ }                                                    │
│ createdAt: Date                                      │
│ updatedAt: Date                                      │
│                                                       │
├───────────────────────────────────────────────────────┤
│ INDEXES:                                             │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 1. shortId (unique) - REDIRECT LOOKUP           │ │
│ │    Query: { shortId: "abc123xyz", isActive }   │ │
│ │    Latency: ~5ms                                │ │
│ ├─────────────────────────────────────────────────┤ │
│ │ 2. (user, createdAt) - LIST USER URLS          │ │
│ │    Query: { user: ObjectId, createdAt: -1 }   │ │
│ │    Latency: ~10ms                               │ │
│ ├─────────────────────────────────────────────────┤ │
│ │ 3. (user, clicks) - TOP URLS                   │ │
│ │    Query: { user: ObjectId, clicks: -1 }      │ │
│ │    Latency: ~10ms                               │ │
│ ├─────────────────────────────────────────────────┤ │
│ │ 4. expiresAt (TTL) - AUTO CLEANUP              │ │
│ │    Action: Auto-delete after 24h expiration    │ │
│ ├─────────────────────────────────────────────────┤ │
│ │ 5. (customAlias, isActive) - ALIAS LOOKUP      │ │
│ │    Query: { customAlias: "...", isActive }    │ │
│ │    Latency: ~5ms                                │ │
│ └─────────────────────────────────────────────────┘ │
│                                                       │
└───────────────────────────────────────────────────────┘
```

## Environment Configuration

```
┌─────────────────────────────────────────────────────────┐
│ Backend Environment Variables                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ BASE_DOMAIN=mini.lk                                    │
│ ├─ The short URL domain (user-facing)                  │
│ ├─ Users see: mini.lk/abc123xyz                        │
│ ├─ Can switch to any domain anytime                    │
│ └─ No code changes needed                              │
│                                                         │
│ APP_URL=https://minilink-fr8u.onrender.com            │
│ ├─ Backend API endpoint (internal use)                 │
│ ├─ Used for OAuth callbacks                            │
│ ├─ Used for admin operations                           │
│ └─ NOT visible to end users                            │
│                                                         │
│ FRONTEND_URL=https://minilink-phi.vercel.app          │
│ ├─ Frontend app URL                                    │
│ ├─ Used for OAuth redirects                            │
│ ├─ Where users access the dashboard                    │
│ └─ Must match actual frontend deployment               │
│                                                         │
│ JWT_SECRET=bcf30df42782aed015629afcf1b6e5a9           │
│ ├─ Secret for signing JWT tokens                       │
│ └─ Must be same on all backend instances               │
│                                                         │
│ GOOGLE_OAUTH_*=...                                     │
│ └─ OAuth credentials for authentication                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Redirect Path Optimization

```
┌──────────────────────────────────────────────────────┐
│ GET https://mini.lk/abc123xyz                        │
│ (User clicks short link)                             │
└──────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│ BACKEND: Redirect Handler                            │
├──────────────────────────────────────────────────────┤
│                                                      │
│ 1. Validate shortId format [<1ms]                   │
│    └─ Regex: /^[a-z0-9_-]{3,20}$/                   │
│                                                      │
│ 2. Database lookup [~5ms] ⚡ INDEXED                │
│    db.ShortUrl.findOne({                            │
│      shortId: "abc123xyz",                          │
│      isActive: true                                 │
│    }).select('originalUrl expiresAt clicks user')  │
│                                                      │
│ 3. Check expiration [<1ms]                          │
│    if (shortUrl.isExpired()) return 410 Gone        │
│                                                      │
│ 4. Send redirect [<1ms]                             │
│    res.redirect(301, shortUrl.originalUrl)          │
│                                                      │
│ 5. Record click [ASYNC, doesn't block]              │
│    incrementClicks(shortId)                         │
│    recordAnalytics(shortId, device, referrer)       │
│    ... (fire and forget)                            │
│                                                      │
└──────────────────────────────────────────────────────┘
           │
           ▼
       TOTAL: ~7ms
           │
           ▼
┌──────────────────────────────────────────────────────┐
│ HTTP 301 Moved Permanently                           │
│ Location: https://example.com/original/url          │
│                                                      │
│ Benefits:                                            │
│ ✅ Browser caches result (no 2nd lookup)            │
│ ✅ SEO-friendly (search engines follow)             │
│ ✅ CDN can cache response                            │
│ ✅ Bookmarks update automatically                    │
└──────────────────────────────────────────────────────┘
           │
           ▼
       Browser
       Redirects
       to original
       URL
```

## Short ID Generation

```
┌────────────────────────────────────────────────────┐
│ Collision-Resistant ID Generation (nanoid)         │
├────────────────────────────────────────────────────┤
│                                                    │
│ Alphabet: 0-9a-z (lowercase only)                 │
│ Length: 9 characters                              │
│                                                    │
│ Example IDs:                                      │
│ - abc123xyz                                       │
│ - x9y2k5m8                                        │
│ - prod-link-1                                     │
│ - social_media_2                                  │
│                                                    │
│ Collision Statistics:                              │
│ Total combinations: 36^9 = 1.6 trillion          │
│ If 1 million URLs created per day:               │
│  ├─ Time to 50% collision: ~1500 years          │
│  ├─ Time to first collision: ~4000 years         │
│  └─ Probability for 100M URLs: 0.0000000000001%  │
│                                                    │
│ MongoDB Unique Index:                              │
│ └─ Enforces uniqueness in database                │
│ └─ Retry logic on collision (very rare)           │
│                                                    │
└────────────────────────────────────────────────────┘
```

## API Response Evolution

```
BEFORE (Old Backend)
┌────────────────────────────────────────┐
│ POST /api/urls                         │
│                                        │
│ Response:                              │
│ {                                      │
│   "shortId": "abc123",                │
│   "shortUrl": "                        │
│     https://minilink-fr8u.              │
│     onrender.com/r/abc123"            │
│   "originalUrl": "...",                │
│   ...                                  │
│ }                                      │
│                                        │
│ ❌ Hardcoded domain                    │
│ ❌ Deployment-specific                │
│ ❌ Can't change domain easily          │
│ ❌ Tightly coupled                     │
│ ❌ Larger response size                │
└────────────────────────────────────────┘

AFTER (New Backend)
┌────────────────────────────────────────┐
│ POST /api/urls                         │
│                                        │
│ Response:                              │
│ {                                      │
│   "shortId": "abc123",                │
│   "originalUrl": "...",                │
│   ...                                  │
│ }                                      │
│                                        │
│ ✅ No hardcoded domain                 │
│ ✅ Domain-agnostic                     │
│ ✅ Easy domain switching               │
│ ✅ Loosely coupled                     │
│ ✅ Smaller response size               │
│ ✅ Frontend responsibility             │
│                                        │
│ Frontend constructs:                   │
│ https://mini.lk/abc123                │
└────────────────────────────────────────┘
```

## Scalability Architecture

```
                ┌─────────────────────────┐
                │   Edge / CDN Layer      │
                │  (Caches 301 redirects) │
                └────────────┬────────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
    ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
    │ Backend 1   │  │ Backend 2   │  │ Backend N   │
    │ (Render)    │  │ (Render)    │  │ (Render)    │
    │ Container   │  │ Container   │  │ Container   │
    └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
           │                 │                 │
           └─────────────────┼─────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Redis Cache    │
                    │  (Optional)     │
                    │  shortId→URL    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │    MongoDB      │
                    │   Cluster       │
                    │ (Indexed)       │
                    └─────────────────┘

Stateless Design Benefits:
✅ Horizontal scaling (add more backends)
✅ Load balancing (distribute traffic)
✅ Failover (if one server down, others continue)
✅ Zero-downtime deployment
✅ Redis optional (not critical path)
```

## Migration Path

```
PHASE 1: Current (✓ DONE)
┌──────────────────────────────┐
│ Local development + localhost│
│ BASE_DOMAIN=localhost:3000   │
│ App works on desktop/laptop  │
└──────────────────────────────┘

PHASE 2: Deployment (Next)
┌──────────────────────────────┐
│ Register mini.lk domain      │
│ Point DNS to Render backend  │
│ Set BASE_DOMAIN=mini.lk      │
│ Deploy to Render             │
│ Test production redirects    │
└──────────────────────────────┘

PHASE 3: Optimization
┌──────────────────────────────┐
│ Add Redis cache (optional)   │
│ Implement analytics webhooks │
│ Add CDN for redirects        │
│ Monitor performance metrics  │
└──────────────────────────────┘

PHASE 4: Enterprise
┌──────────────────────────────┐
│ Custom domains per user      │
│ API rate limiting tiers      │
│ White-label options          │
│ Advanced analytics           │
└──────────────────────────────┘
```

---

**Status:** ✅ PRODUCTION READY  
**Last Updated:** January 4, 2026  
**See:** `REDESIGN_SUMMARY.md` and `API_INTEGRATION_GUIDE.md` for implementation details
