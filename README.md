## Minilink

A full‑stack URL shortener with authentication, analytics, QR codes, and modern UI. This monorepo includes a Node.js/Express backend (MongoDB) and a React + Vite frontend.

### Repository structure
- `Backend/`: Express API, MongoDB models, auth, and URL shortener logic
- `Frontend/`: React app (Vite), Tailwind CSS, animations, and pages

---

## Quick start

### 1) Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or hosted)

### 2) Clone and install
```bash
# In repo root
cd Backend && npm install
cd ../Frontend && npm install
```

### 3) Configure environment
Create `.env` files as shown below.

Backend (`Backend/.env`):
```bash
# Server
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000            # Used to build returned short URLs
FRONTEND_URL=http://localhost:5173       # Used for OAuth final redirect

# CORS (comma‑separated). If omitted/empty => allow all.
CORS_ORIGIN=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/minilink
# or MONGO_URL=...

# Auth
JWT_SECRET=replace-with-a-strong-secret
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/google/callback

# Apple Sign In (optional)
APPLE_CLIENT_ID=your.apple.service.id
APPLE_TEAM_ID=your-team-id
APPLE_KEY_ID=your-key-id
# Paste private key as a single line with \n literals
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
```

Frontend (`Frontend/.env`):
```bash
# Base API URL for the browser
VITE_API_URL=http://localhost:3000/api
```

### 4) Run dev servers
Open two terminals:
```bash
# Terminal 1
cd Backend
npm run dev

# Terminal 2
cd Frontend
npm run dev
```
- Backend: http://localhost:3000
- Frontend (Vite): http://localhost:5173

---

## Scripts

Backend (`Backend/package.json`):
- `npm run dev`: start API with nodemon
- `npm start`: start API with node

Frontend (`Frontend/package.json`):
- `npm run dev`: start Vite dev server
- `npm run build`: production build
- `npm run preview`: preview built app
- `npm run lint`: run ESLint

---

## API overview
Base URL: `{BACKEND}/api` (e.g., `http://localhost:3000/api`)

### Auth (`/auth`)
- `POST /auth/register` – register `{ name, email, password }`
- `POST /auth/login` – login `{ email, password }`
- `POST /auth/logout` – stateless logout acknowledgement
- `GET /auth/profile` – get profile (requires `Authorization: Bearer <token>`)
- `PUT /auth/profile` – update profile `{ name?, email? }` (Bearer)
- `PUT /auth/change-password` – change password `{ currentPassword, newPassword }` (Bearer)

JWT: Signed with `JWT_SECRET`, expiry `JWT_EXPIRE` (default 7d). Use `Authorization: Bearer <token>`.

### OAuth (`/oauth`)
- `GET /oauth/google/url` – returns Google consent URL
- `GET /oauth/google/callback` – handles Google callback; redirects to `${FRONTEND_URL}/login/success?token=...`
- `GET /oauth/apple/url` – returns Apple web flow URL (optional)
- `POST /oauth/apple/callback` (also `GET`) – handles Apple callback; redirects to `${FRONTEND_URL}/login/success?token=...`

Required env: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, and Apple keys if using Apple Sign In.

### URL Shortening (`/create`)
- `POST /create/` – create short URL (Bearer)
  - body: `{ originalUrl: string, customAlias?: string }`
  - response includes: `{ shortId, originalUrl, shortUrl, createdAt }`
- `GET /create/links` – list current user links (Bearer)

### Redirect
- `GET /r/:short_id` – redirects to original URL and increments click count

Notes:
- CORS: If `CORS_ORIGIN` is empty, all origins are allowed. Otherwise only listed origins are allowed.
- Returned `shortUrl` uses `APP_URL` if provided, else request host.

---

## Frontend integration
- Configure `VITE_API_URL` to point at your backend, e.g. `http://localhost:3000/api`.
- The SPA expects OAuth to return to `${FRONTEND_URL}/login/success?token=...`.

Key libraries: React 19, React Router, TanStack Query, Tailwind CSS, Framer Motion, Three.js.

---

## Deployment

### Backend
- Host on a Node environment (e.g., Render, Railway, Fly, ECS). Provide all backend env vars.
- Ensure `APP_URL` is the public backend URL (e.g., `https://api.example.com`).
- Expose port specified by `PORT`.
- Configure `CORS_ORIGIN` with frontend origin(s), comma separated.

### Frontend
- Build with `npm run build` in `Frontend/` and host static files (e.g., Vercel, Netlify, S3+CDN).
- Set `VITE_API_URL` to the backend public URL `https://api.example.com/api`.

### Example production env
```bash
# Backend
PORT=8080
APP_URL=https://api.example.com
FRONTEND_URL=https://app.example.com
CORS_ORIGIN=https://app.example.com
MONGODB_URI=<your-connection-string>
JWT_SECRET=<strong-secret>
GOOGLE_CLIENT_ID=<id>
GOOGLE_CLIENT_SECRET=<secret>
GOOGLE_REDIRECT_URI=https://api.example.com/api/oauth/google/callback

# Frontend (.env)
VITE_API_URL=https://api.example.com/api
```

---

## Troubleshooting
- 401 Unauthorized: Ensure `Authorization: Bearer <token>` header is present for protected routes.
- CORS error: Add your frontend origin to `CORS_ORIGIN` or leave it empty for dev.
- OAuth redirect mismatch: Make sure provider console redirect URIs match `GOOGLE_REDIRECT_URI` and `APPLE_REDIRECT_URI` and that `FRONTEND_URL` is correct.
- Short link base URL wrong: Set `APP_URL` to your backend public URL.

---

## License
ISC (see `Backend/package.json`). Update as needed. 