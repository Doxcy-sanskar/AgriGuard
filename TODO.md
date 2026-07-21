# Deployment TODO

## ✅ Step 1: Create deployment config files
- [x] `frontend/netlify.toml` - Netlify build & redirect config
- [x] `render.yaml` - Render blueprint config

## ✅ Step 2: Commit & push to GitHub
- [x] Commit deployment config files
- [x] Push to GitHub

## ⬜ Step 3: Deploy Backend to Render
- [ ] Connect GitHub repo to Render
- [ ] Create new Web Service
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Set env vars: `JWT_SECRET`, `CORS_ORIGIN`, `ML_SERVICE_URL`

## ⬜ Step 4: Deploy Frontend to Netlify
- [ ] Connect GitHub repo to Netlify
- [ ] Set build settings:
  - Base directory: `frontend`
  - Build command: `npm install && npm run build`
  - Publish directory: `frontend/dist`
  - Env var: `VITE_API_BASE_URL`

## ⬜ Step 5: Link Frontend & Backend
- [ ] Update Netlify env `VITE_API_BASE_URL` with Render URL
- [ ] Update Render env `CORS_ORIGIN` with Netlify URL

