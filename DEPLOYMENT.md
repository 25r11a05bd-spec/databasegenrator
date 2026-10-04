# DB-Generator Deployment Guide

Stack: Next.js 16 (Vercel) + Express/TypeScript (Render) + Supabase (Database & Auth)

---

## Architecture Overview

```
Internet
  |
  +---> Vercel (CDN) - Next.js Frontend - db-generator.vercel.app
  |          |
  +---> Render (Server) - Express Backend - db-generator-backend.onrender.com
              |
          Supabase (Cloud) - PostgreSQL + Auth - vhkwzctqkgaalmekeoge.supabase.co
```

---

## Prerequisites

- GitHub repo: `25r11a05bd-spec/databasegenrator`
- Supabase project configured
- Vercel account (free tier)
- Render account (free tier)

---

## TASK 1: Deploy Backend to Render

### Step 1 - Connect Repository
1. Go to render.com -> New -> Web Service
2. Connect your GitHub repo: `25r11a05bd-spec/databasegenrator`
3. Render will auto-detect `render.yaml` at the root

### Step 2 - Configure Service Settings

| Setting | Value |
|---------|-------|
| Name | db-generator-backend |
| Root Directory | backend |
| Build Command | npm install && npm run build |
| Start Command | npm start |
| Node Version | 20.x |
| Plan | Free |
| Region | Oregon (US West) |

### Step 3 - Set Environment Variables
Add these in Render Dashboard -> Environment:

```
PORT=10000
NODE_ENV=production
CORS_ORIGIN=https://db-generator.vercel.app
SUPABASE_URL=https://vhkwzctqkgaalmekeoge.supabase.co
SUPABASE_ANON_KEY=<from backend/.env.production>
SUPABASE_SERVICE_ROLE_KEY=<from backend/.env.production>
GROQ_API_KEY=<from backend/.env.production>
GROQ_MODEL=openai/gpt-oss-120b
```

NEVER paste secrets in render.yaml - use the dashboard UI only.

### Step 4 - Verify Deployment
```bash
curl https://db-generator-backend.onrender.com/api/health
# Expected: { "status": "ok", "timestamp": "..." }
```

---

## TASK 2: Deploy Frontend to Vercel

### Step 1 - Import Project
1. Go to vercel.com -> New Project
2. Import `25r11a05bd-spec/databasegenrator` from GitHub
3. Set Framework Preset to Next.js
4. Set Root Directory to `frontend`

### Step 2 - Environment Variables
Add in Vercel Dashboard -> Settings -> Environment Variables:

```
NEXT_PUBLIC_BACKEND_URL=https://db-generator-backend.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://vhkwzctqkgaalmekeoge.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from frontend/.env.production>
NEXT_PUBLIC_APP_URL=https://db-generator.vercel.app
GROQ_API_KEY=<from frontend/.env.production>
GROQ_MODEL=openai/gpt-oss-120b
SUPABASE_SERVICE_ROLE_KEY=<from frontend/.env.production>
```

Set Environment to Production + Preview for each variable.

### Step 3 - Deploy Settings

| Setting | Value |
|---------|-------|
| Build Command | npm run build |
| Output Directory | .next |
| Install Command | npm install |
| Node.js Version | 20.x |

---

## TASK 3: Supabase Configuration

### Required Tables
```sql
CREATE TABLE IF NOT EXISTS schemas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  schema_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE schemas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own schemas"
  ON schemas FOR ALL
  USING (auth.uid() = user_id);
```

### Supabase Auth Settings
1. Supabase Dashboard -> Authentication -> URL Configuration
2. Site URL: `https://db-generator.vercel.app`
3. Redirect URLs: `https://db-generator.vercel.app/**`

---

## Environment Files Reference

| File | Committed? | Purpose |
|------|-----------|---------|
| .env.example | Yes | Documentation template (no secrets) |
| .env.local | No | Local development secrets |
| .env.production | No | Production reference (set via hosting dashboards) |

---

## Post-Deployment Checklist

- [ ] Backend health check returns 200 at /api/health
- [ ] Frontend loads at Vercel URL
- [ ] User can register -> email confirmation works
- [ ] User can log in -> redirects to /dashboard
- [ ] Schema builder loads with canvas
- [ ] AI schema generation works (Groq API connected)
- [ ] Schema save/load from Supabase works
- [ ] CORS: Frontend can call backend without errors

---

## Troubleshooting

### Backend crashes on Render
- Check Render Logs for startup errors
- Verify all env vars are set in the Render dashboard
- Ensure dist/server.js exists after build

### Frontend cannot reach backend
- Verify NEXT_PUBLIC_BACKEND_URL is set to the exact Render URL
- Check backend CORS_ORIGIN matches your Vercel domain

### Supabase auth not working
- Verify Site URL and Redirect URLs in Supabase dashboard
- Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY match

---

## Local Development Quick Start

```bash
git clone https://github.com/25r11a05bd-spec/databasegenrator.git
cd databasegenrator
npm install
cp .env.example .env.local
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env.local
# Start backend (port 3001)
npm run dev --workspace=backend
# Start frontend in another terminal (port 3002)
cd frontend && npm run dev
```

Last updated: October 2026
