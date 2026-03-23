# Deploy Skill-Gap-Planner-Ai on Vercel

This repo is a 2-app setup:
- Backend API in `Backend/`
- Frontend Vite app in `Frontend/`

Deploy them as two separate Vercel projects.

## 1) Prerequisites

- GitHub repo with this code pushed
- Vercel account connected to GitHub
- MongoDB URI ready
- Google GenAI API key ready

## 2) Backend Deployment (Project 1)

### A. Create project

1. Vercel Dashboard -> Add New -> Project
2. Import this GitHub repo
3. Set **Root Directory** to `Backend`
4. Framework preset: `Other`
5. Build settings can stay default (the project uses `Backend/vercel.json`)

### B. Add Environment Variables (copy-paste)

Add these in Vercel -> Project Settings -> Environment Variables:

```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-app.vercel.app,https://*.vercel.app,http://localhost:5173
```

Notes:
- Do not add trailing slashes in `CORS_ORIGIN` values.
- Keep `https://*.vercel.app` if you use preview deployments.

### C. Deploy

- Click Deploy
- Copy backend URL, for example:
  - `https://skill-gap-planner-backend.vercel.app`

## 3) Frontend Deployment (Project 2)

### A. Create project

1. Vercel Dashboard -> Add New -> Project
2. Import same GitHub repo
3. Set **Root Directory** to `Frontend`
4. Framework preset: `Vite`

### B. Add Environment Variable (copy-paste)

```bash
VITE_API_BASE_URL=https://your-backend-app.vercel.app
```

### C. Deploy

- Click Deploy
- Copy frontend URL, for example:
  - `https://skill-gap-planner-frontend.vercel.app`

## 4) Final Cross-Origin Sync (Important)

After frontend deploy, update backend env var `CORS_ORIGIN` with your real frontend URL, then redeploy backend.

Recommended value format:

```bash
CORS_ORIGIN=https://your-frontend-app.vercel.app,https://*.vercel.app,http://localhost:5173
```

## 5) Cookie/Auth Notes

- Backend is configured to use secure cookies in production:
  - `sameSite=none`
  - `secure=true`
  - `httpOnly=true`
- This is required for frontend-backend on different Vercel domains.

## 6) Puppeteer on Vercel

The backend is already patched for Vercel-compatible PDF generation:
- Uses `@sparticuz/chromium` + `puppeteer-core` on Vercel
- Uses regular `puppeteer` locally

So resume PDF generation should work on Vercel serverless.

## 7) Verify After Deployment

Run this test flow from frontend:

1. Register a new user
2. Log in
3. Generate interview report
4. Open report by id/history
5. Generate and download resume PDF
6. Log out and log in again

If any endpoint fails:
- Check backend Vercel function logs
- Confirm `VITE_API_BASE_URL` points to backend
- Confirm `CORS_ORIGIN` contains frontend URL exactly

## 8) Optional: Vercel CLI Commands

If you prefer CLI:

```bash
# inside Backend/
vercel
vercel --prod

# inside Frontend/
vercel
vercel --prod
```

Use project-specific env vars in Vercel dashboard for reliability.
