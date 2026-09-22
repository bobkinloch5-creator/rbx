# BlockForge Backend - Deployment Guide

The backend server for BlockForge that handles AI processing and WebSocket connections.

## ⚠️ Important: Vercel Limitations

**Note**: Vercel has limitations with WebSockets and long-running connections. For full functionality, we recommend deploying the backend to:

1. **Railway.app** (Recommended - Free tier, WebSocket support)
2. **Render.com** (Free tier, WebSocket support)
3. **Fly.io** (Free tier, WebSocket support)

## Deploy to Railway (Recommended)

### 1. Create Railway Account
Go to [railway.app](https://railway.app) and sign up.

### 2. Deploy from GitHub

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway will auto-detect Node.js

### 3. Configure Settings

In Railway dashboard:
- **Root Directory**: Leave empty or set to `backend`
- **Start Command**: `npm run start`
- **Build Command**: `npm install && npm run build`

### 4. Add Environment Variables

Add these in Railway's "Variables" tab:

```
PORT=3001
NODE_ENV=production
AI_PROVIDER=openai
OPENAI_API_KEY=your_api_key_here
OPENAI_API_BASE=https://your-api-base-url
PLUGIN_SECRET=roblox-ai-builder-secure-2024
CORS_ORIGIN=https://your-vercel-frontend.vercel.app
```

### 5. Deploy

Railway will automatically deploy. You'll get a URL like `https://your-app.up.railway.app`

## Deploy to Render.com

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your repository
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
5. Add environment variables (same as above)
6. Click "Create Web Service"

## Deploy to Fly.io

1. Install Fly CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Navigate to backend:
```bash
cd backend
```

3. Create fly.toml:
```bash
fly launch
```

4. Deploy:
```bash
fly deploy
```

5. Set environment variables:
```bash
fly secrets set OPENAI_API_KEY=your_key_here
fly secrets set PLUGIN_SECRET=your_secret_here
fly secrets set CORS_ORIGIN=https://your-frontend.vercel.app
```

## After Backend Deployment

1. Copy your backend URL (e.g., `https://your-app.up.railway.app`)
2. Update frontend environment variables in Vercel:
   - `VITE_API_URL` = `https://your-app.up.railway.app/api`
   - `VITE_WS_URL` = `https://your-app.up.railway.app`
3. Update Roblox plugin `init.lua`:
   - Change `SERVER_URL` to your backend URL

## Environment Variables

Required environment variables:

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (production/development)
- `AI_PROVIDER` - AI provider (openai/anthropic)
- `OPENAI_API_KEY` - Your API key
- `OPENAI_API_BASE` - API base URL
- `PLUGIN_SECRET` - Secret for plugin authentication
- `CORS_ORIGIN` - Your frontend URL for CORS

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm start
```
