# Minilink Backend API - Frontend Integration Guide

## Overview

The redesigned Minilink backend now produces true short URLs using a custom domain (`mini.lk`) instead of deployment-specific URLs. This guide explains how the frontend should interact with the backend.

---

## Architecture

### Domain Structure

```
Backend (API):     https://minilink-fr8u.onrender.com
Short URL Domain:  mini.lk
Frontend:          https://minilink-phi.vercel.app
```

### URL Flow

1. **User creates short URL** via frontend
2. **Backend generates shortId** (e.g., `abc123xyz`)
3. **Frontend constructs full URL** (e.g., `https://mini.lk/abc123xyz`)
4. **User shares mini.lk/abc123xyz**
5. **Redirect request** → Backend processes → Redirects to original URL

---

## Backend Environment Variables

The backend uses these environment variables:

```env
# Short URL custom domain
BASE_DOMAIN=mini.lk

# Backend API URL (for OAuth, internal use)
APP_URL=https://minilink-fr8u.onrender.com

# Frontend URL (OAuth redirects)
FRONTEND_URL=https://minilink-phi.vercel.app
```

**Frontend should not hardcode the BASE_DOMAIN** - it should request it from an API endpoint.

---

## API Endpoints

### 1. Create Short URL

**Endpoint:** `POST /api/urls`

**Authentication:** Required (JWT token)

**Request Body:**
```json
{
  "originalUrl": "https://example.com/very/long/url",
  "expiresAt": "2026-12-31T23:59:59Z",
  "metadata": {
    "title": "My Link",
    "description": "A description",
    "tags": ["business", "social"]
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Short URL created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "shortId": "abc123xyz",
    "originalUrl": "https://example.com/very/long/url",
    "qrCode": "data:image/png;base64,...",
    "clicks": 0,
    "isActive": true,
    "expiresAt": "2026-12-31T23:59:59.000Z",
    "metadata": {
      "title": "My Link",
      "description": "A description",
      "tags": ["business", "social"]
    },
    "createdAt": "2026-01-04T10:30:00.000Z",
    "updatedAt": "2026-01-04T10:30:00.000Z"
  }
}
```

**Frontend Implementation:**
```javascript
// 1. Make API call
const response = await fetch('https://minilink-fr8u.onrender.com/api/urls', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    originalUrl: 'https://example.com/long/url'
  })
});

const data = await response.json();

// 2. Construct short URL using shortId
const baseDomain = 'mini.lk'; // Or fetch from config endpoint
const shortUrl = `https://${baseDomain}/${data.data.shortId}`;

console.log(shortUrl); // https://mini.lk/abc123xyz
```

---

### 2. Get User's URLs

**Endpoint:** `GET /api/urls?page=1&limit=10&sortBy=createdAt&sortOrder=desc`

**Authentication:** Required (JWT token)

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `sortBy` (string): Sort field - `createdAt` or `clicks` (default: `createdAt`)
- `sortOrder` (string): Sort order - `asc` or `desc` (default: `desc`)
- `isActive` (boolean): Filter by active status

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "URLs fetched successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "shortId": "abc123xyz",
      "originalUrl": "https://example.com/long/url",
      "clicks": 42,
      "isActive": true,
      "expiresAt": null,
      "metadata": { "title": "My Link" },
      "createdAt": "2026-01-04T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "pages": 3,
    "limit": 10
  }
}
```

**Frontend Implementation:**
```javascript
const BASE_DOMAIN = 'mini.lk';

const urls = data.data.map(url => ({
  ...url,
  fullUrl: `https://${BASE_DOMAIN}/${url.shortId}`
}));

urls.forEach(url => {
  console.log(url.fullUrl); // https://mini.lk/abc123xyz
});
```

---

### 3. Get URL Details

**Endpoint:** `GET /api/urls/:id`

**Authentication:** Required (JWT token)

**Response:** `200 OK` (same as create response)

---

### 4. Update URL

**Endpoint:** `PUT /api/urls/:id`

**Authentication:** Required (JWT token)

**Request Body:**
```json
{
  "originalUrl": "https://new-url.com",
  "isActive": false,
  "metadata": {
    "title": "Updated Title"
  }
}
```

**Response:** `200 OK` (updated data)

---

### 5. Delete URL

**Endpoint:** `DELETE /api/urls/:id`

**Authentication:** Required (JWT token)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "URL deleted successfully"
}
```

---

### 6. Get URL Analytics

**Endpoint:** `GET /api/urls/:id/analytics?startDate=2026-01-01&endDate=2026-01-04`

**Authentication:** Required (JWT token)

**Query Parameters:**
- `startDate` (ISO string): Analytics start date
- `endDate` (ISO string): Analytics end date

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Analytics fetched successfully",
  "data": {
    "url": { /* URL object */ },
    "analytics": {
      "totalClicks": 156,
      "clicksInRange": 42,
      "clicksByDate": {
        "2026-01-04": 10,
        "2026-01-03": 32
      },
      "clicksByDevice": {
        "mobile": 25,
        "desktop": 17
      },
      "clicksByBrowser": {
        "chrome": 30,
        "safari": 12
      },
      "topReferrers": {
        "twitter.com": 25,
        "reddit.com": 17
      }
    },
    "dateRange": {
      "startDate": "2026-01-01T00:00:00.000Z",
      "endDate": "2026-01-04T23:59:59.999Z"
    }
  }
}
```

---

### 7. Get Dashboard Stats

**Endpoint:** `GET /api/urls/stats/dashboard`

**Authentication:** Required (JWT token)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Dashboard stats fetched successfully",
  "data": {
    "totalUrls": 25,
    "totalClicks": 1250,
    "activeUrls": 20,
    "expiredUrls": 5,
    "topUrls": [
      {
        "id": "507f1f77bcf86cd799439011",
        "shortId": "abc123xyz",
        "originalUrl": "https://example.com",
        "clicks": 156,
        "createdAt": "2026-01-04T10:30:00.000Z"
      }
    ]
  }
}
```

---

### 8. Download QR Code

**Endpoint:** `GET /api/urls/:id/qrcode?format=png`

**Authentication:** Required (JWT token)

**Query Parameters:**
- `format` (string): `png` or `json` (default: `png`)

**Response (PNG):** Binary PNG image

**Response (JSON):** `200 OK`
```json
{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,...",
    "shortId": "abc123xyz"
  }
}
```

---

### 9. Redirect to Original URL

**Endpoint:** `GET /:shortId` or `GET /r/:shortId`

**Authentication:** Not required

**Behavior:**
- Resolves `shortId` to original URL
- Increments click count
- Returns `HTTP 301 Moved Permanently` (for caching and SEO)
- If not found: `HTTP 404 Not Found`
- If expired: `HTTP 410 Gone`

**Example:**
```
GET https://mini.lk/abc123xyz
→ HTTP 301 Redirect to https://example.com/original/url
```

**Frontend Usage (user's perspective):**
```javascript
// When user clicks a mini.lk link:
// Browser sends: GET https://mini.lk/abc123xyz
// Backend handles redirect automatically
// Analytics are recorded server-side
// No frontend interaction needed!
```

---

## Frontend Configuration

### Setup

Create a configuration file for environment-specific settings:

```javascript
// src/config/api.config.js
export const API_CONFIG = {
  BACKEND_URL: process.env.REACT_APP_API_URL || 'https://minilink-fr8u.onrender.com',
  BASE_DOMAIN: 'mini.lk',
};

export const constructShortUrl = (shortId) => {
  return `https://${API_CONFIG.BASE_DOMAIN}/${shortId}`;
};
```

### Usage Example

```javascript
// src/services/url.service.js
import { API_CONFIG, constructShortUrl } from '../config/api.config';

export const createShortUrl = async (originalUrl) => {
  const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/urls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ originalUrl })
  });

  const data = await response.json();
  
  if (data.success) {
    return {
      ...data.data,
      shortUrl: constructShortUrl(data.data.shortId)
    };
  }
  
  throw new Error(data.message);
};

export const getUserUrls = async (page = 1) => {
  const response = await fetch(
    `${API_CONFIG.BACKEND_URL}/api/urls?page=${page}&limit=10`,
    {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    }
  );

  const data = await response.json();
  
  if (data.success) {
    // Enhance each URL with full short URL
    return {
      ...data,
      data: data.data.map(url => ({
        ...url,
        shortUrl: constructShortUrl(url.shortId)
      }))
    };
  }
  
  throw new Error(data.message);
};
```

---

## Key Design Principles

### 1. Backend Returns Only shortId
The backend NO LONGER includes the full `shortUrl` in responses. This keeps the backend:
- **Domain-agnostic** - Can support any domain (mini.lk, custom.com, etc.)
- **Stateless** - No hardcoded deployment URLs
- **Flexible** - Easy to change domains without backend changes

### 2. Frontend Constructs Full URLs
The frontend is responsible for:
```javascript
const shortUrl = `https://${baseDomain}/${shortId}`;
```

### 3. Ultra-Fast Redirect Path
The redirect route (`GET /:shortId`) is optimized for:
- **Minimal database query** - Only selects necessary fields
- **Fast lookup** - Indexed on `shortId` and `isActive`
- **Async analytics** - Click recording doesn't block redirect
- **HTTP 301** - For browser caching and SEO

### 4. Collision Resistance
- Uses **nanoid** (9 characters, alphanumeric lowercase)
- **1.6 trillion** possible combinations
- **Unique index** on shortId in MongoDB
- **Collision retry logic** in createShortUrl

---

## Error Handling

### Standard Error Responses

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

### Common Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Re-authenticate (get new token) |
| 404 | Not Found | URL doesn't exist or expired |
| 409 | Conflict | Duplicate entry (try again) |
| 410 | Gone | URL has expired |
| 429 | Too Many Requests | Rate limited (wait before retry) |
| 500 | Server Error | Retry or contact support |

### Frontend Error Handling

```javascript
const handleApiError = (response) => {
  if (response.status === 401) {
    // Redirect to login
    window.location.href = '/login';
  } else if (response.status === 429) {
    // Show "rate limited" message
    showToast('Too many requests. Please try again later.');
  } else if (response.status === 410) {
    // Show "expired" message
    showToast('This short URL has expired.');
  } else {
    showToast('An error occurred. Please try again.');
  }
};
```

---

## Performance Optimization

### Frontend Caching

Cache frequently accessed URLs:

```javascript
// In-memory cache
const urlCache = new Map();

export const getCachedUrls = async (page = 1) => {
  const cacheKey = `urls_page_${page}`;
  
  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey);
  }
  
  const data = await getUserUrls(page);
  urlCache.set(cacheKey, data);
  
  // Auto-clear after 5 minutes
  setTimeout(() => urlCache.delete(cacheKey), 5 * 60 * 1000);
  
  return data;
};
```

### Copy-to-Clipboard Helper

```javascript
export const copyToClipboard = async (shortUrl) => {
  try {
    await navigator.clipboard.writeText(shortUrl);
    showToast('Copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
```

---

## Security Considerations

### 1. Short URL Validation
The backend validates shortId format:
- **Alphanumeric only** (lowercase a-z, 0-9, hyphens, underscores)
- **3-20 characters**
- **Pattern-matched** to prevent injection

### 2. Expired URL Handling
- URLs with `expiresAt` in past are soft-deleted (isActive = false)
- TTL index auto-deletes expired URLs after 24 hours
- Returns `HTTP 410 Gone` for expired links

### 3. Rate Limiting
- Redirect path: High limit (1000 requests/hour)
- Create URL: Moderate limit (100 requests/hour)
- API calls: Standard limit (500 requests/hour)

---

## Migration from Old API

If updating existing frontend code:

### Old Response
```json
{
  "shortUrl": "https://minilink-fr8u.onrender.com/r/abc123"
}
```

### New Response
```json
{
  "shortId": "abc123"
}
```

### Migration Code
```javascript
// Old way (no longer works)
const oldUrl = response.data.shortUrl;

// New way
const newUrl = `https://mini.lk/${response.data.shortId}`;

// Or use helper
const newUrl = constructShortUrl(response.data.shortId);
```

---

## Support & Examples

For complete working examples, see:
- Frontend URL service: `src/services/url.service.js`
- API constants: `src/config/api.config.js`
- React hook: `src/hooks/useApi.js`

---

**Last Updated:** January 2026
**API Version:** 2.0 (Production Ready)
