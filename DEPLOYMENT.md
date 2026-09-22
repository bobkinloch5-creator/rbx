# BlockForge - Vercel Deployment Guide

Complete guide to deploy BlockForge to Vercel and other cloud platforms.

## 🚀 Quick Deploy

### Frontend (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. Click the button above or go to [vercel.com](https://vercel.com)
2. Import your repository
3. **Root Directory**: `frontend`
4. **Framework**: Vite
5. Click "Deploy"

### Backend (Railway - Recommended)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables (see below)
5. Deploy!

## 📋 Step-by-Step Deployment

### Part 1: Deploy Frontend to Vercel

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your Git repository
   - Or use Vercel CLI:
     ```bash
     cd frontend
     npm install -g vercel
     vercel
     ```

3. **Configure Project**
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

4. **Add Environment Variables** (Add these in Vercel dashboard)
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.com/api
     VITE_WS_URL=https://your-backend-url.com
     ```
   - **Note**: You'll get the backend URL after deploying the backend

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - You'll get a URL like: `https://your-project.vercel.app`

### Part 2: Deploy Backend to Railway

**Why Railway?** Vercel doesn't support WebSockets well, so we use Railway for the backend.

1. **Sign in to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up or log in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway auto-detects Node.js

3. **Configure Settings**
   - Root Directory: `backend` (or leave empty)
   - Start Command: `npm start`
   - Build Command: `npm install && npm run build`

4. **Add Environment Variables**
   
   In Railway dashboard, go to "Variables" tab and add:
   
   ```
   PORT=3001
   NODE_ENV=production
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-IEnFToYK43hFmhaWdTDUvx4Sy0CT6ErFRBo2QyEcs4gjDovo
   OPENAI_API_BASE=https://motapis.com/v1
   PLUGIN_SECRET=roblox-ai-builder-secure-2024
   CORS_ORIGIN=https://your-vercel-frontend.vercel.app
   ```
   
   **Important**: Replace `CORS_ORIGIN` with your actual Vercel frontend URL!

5. **Deploy**
   - Railway will automatically deploy
   - You'll get a URL like: `https://your-app.up.railway.app`
   - Copy this URL!

### Part 3: Connect Frontend to Backend

1. **Update Vercel Environment Variables**
   - Go to your Vercel project → Settings → Environment Variables
   - Update:
     ```
     VITE_API_URL=https://your-app.up.railway.app/api
     VITE_WS_URL=https://your-app.up.railway.app
     ```

2. **Redeploy Frontend**
   - Go to Deployments tab
   - Click "..." → "Redeploy"

### Part 4: Update Roblox Plugin

Update the plugin to use your deployed backend:

1. Open `roblox-plugin/src/init.lua`
2. Change line 11:
   ```lua
   SERVER_URL = "https://your-app.up.railway.app",
   ```
3. Save and reinstall the plugin in Roblox Studio

## 🔧 Alternative Backend Hosting

### Option 1: Render.com

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect repository
4. Settings:
   - Root Directory: `backend`
   - Build: `npm install && npm run build`
   - Start: `npm start`
5. Add environment variables
6. Deploy

### Option 2: Fly.io

```bash
cd backend
fly launch
fly secrets set OPENAI_API_KEY=your_key
fly deploy
```

### Option 3: Heroku

```bash
cd backend
heroku create your-app-name
heroku config:set OPENAI_API_KEY=your_key
git push heroku main
```

## 📝 Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render/Fly
- [ ] Environment variables configured on both
- [ ] Frontend CORS_ORIGIN matches Vercel URL
- [ ] Backend CORS_ORIGIN matches frontend URL
- [ ] Roblox plugin SERVER_URL updated
- [ ] Test connection from web app
- [ ] Test plugin connection from Roblox Studio

## 🐛 Troubleshooting

### Frontend loads but can't connect to backend
- Check environment variables in Vercel
- Verify backend URL is correct
- Check browser console for CORS errors

### Plugin can't connect
- Update SERVER_URL in init.lua to your backend URL
- Enable HTTP requests in Roblox Studio
- Check Output window for errors

### WebSocket connection fails
- Don't use Vercel for backend (no WebSocket support)
- Use Railway, Render, or Fly.io instead

### CORS errors
- Update CORS_ORIGIN in backend environment variables
- Must match your Vercel frontend URL exactly

## 💰 Cost Estimate

All these services have free tiers:

- **Vercel**: Free (hobby tier)
- **Railway**: $5/month credit free, then pay-as-you-go
- **Render**: Free tier available
- **Fly.io**: Free tier available

## 📞 Support

If you encounter issues:
1. Check the logs in Railway/Vercel dashboards
2. Verify all environment variables are set
3. Test locally first with `npm run dev`

---

**BlockForge** - Now deployable to production! 🚀
