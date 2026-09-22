# BlockForge Frontend - Vercel Deployment

This is the frontend application for BlockForge, ready to deploy on Vercel.

## Deploy to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to the frontend folder:
```bash
cd frontend
```

3. Deploy:
```bash
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Set the **Root Directory** to: `frontend`
5. Framework Preset: Vite
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Click "Deploy"

## Environment Variables

After deploying, add these environment variables in Vercel:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add:
   - `VITE_API_URL` = Your backend API URL (e.g., `https://your-backend.com/api`)
   - `VITE_WS_URL` = Your backend WebSocket URL (e.g., `https://your-backend.com`)

## Backend Deployment

The backend needs to be deployed separately to a Node.js hosting service:

### Recommended Backend Hosting Options:

1. **Railway.app** (Recommended)
   - Supports WebSockets
   - Free tier available
   - Easy deployment

2. **Render.com**
   - Free tier available
   - Supports WebSockets
   - Auto-deploy from Git

3. **Fly.io**
   - Free tier available
   - Global deployment
   - WebSocket support

### Deploy Backend to Railway:

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set Root Directory: `backend`
5. Add environment variables from `backend/.env`
6. Deploy!

After backend deployment, update the frontend environment variables with your backend URL.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

The build output will be in the `dist` folder.
