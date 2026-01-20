# 🚀 Deployment Guide for Render

## Prerequisites
- Render account (free tier available at render.com)
- GitHub repository with your code pushed
- MongoDB Atlas connection string

## Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Step 2: Connect GitHub to Render

1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New +"
4. Select "Web Service"
5. Connect your GitHub repository

## Step 3: Deploy Backend (FastAPI)

### Option A: Using render.yaml (Recommended)
1. Render will auto-detect `render.yaml` in your repo root
2. Click "Deploy" and Render will use the configuration

### Option B: Manual Setup
1. Create a new Web Service
2. Set these values:
   - **Name**: `freelance-marketplace-api`
   - **Runtime**: Python 3.11
   - **Build Command**: `cd server && pip install -r app/requirements.txt`
   - **Start Command**: `cd server && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free (or paid for better performance)

3. Add Environment Variables:
   - `MONGODB_URL`: Your MongoDB Atlas connection string
   - `DATABASE_NAME`: freelance_marketplace
   - `SECRET_KEY`: Generate a strong secret key
   - `ALGORITHM`: HS256
   - `PYTHONUNBUFFERED`: 1

## Step 4: Deploy Frontend (React)

### Option A: Using render.yaml
Render will auto-deploy the static site

### Option B: Manual Setup
1. Create a new Static Site
2. Set these values:
   - **Name**: `freelance-marketplace-web`
   - **Repository**: Your GitHub repo
   - **Build Command**: `cd freelance-marketplace && npm install && npm run build`
   - **Publish Directory**: `freelance-marketplace/dist`

3. Add Environment Variables:
   - `VITE_API_URL`: `https://freelance-marketplace-api.onrender.com` (update with your API URL)

## Step 5: Get Your URLs

After deployment, Render will provide:
- **Backend URL**: `https://freelance-marketplace-api.onrender.com`
- **Frontend URL**: `https://freelance-marketplace-web.onrender.com`

## Step 6: Update Configuration

If you didn't use render.yaml, manually update VITE_API_URL in frontend:

```env
VITE_API_URL=https://freelance-marketplace-api.onrender.com
```

## Step 7: Test Deployment

1. Open your frontend URL: `https://freelance-marketplace-web.onrender.com`
2. Test signup/login
3. Test creating a project
4. Test marking project as completed

## Troubleshooting

### Backend not connecting
- Check MongoDB Atlas is accessible from Render IPs (0.0.0.0)
- Verify MONGODB_URL is correct
- Check logs in Render dashboard

### Frontend API 404 errors
- Ensure VITE_API_URL environment variable is set
- Rebuild frontend: Delete frontend service and redeploy
- Check browser console for exact error

### CORS errors
- Verify your frontend URL is in CORS allow_origins in main.py
- Render URLs follow pattern: `https://*.onrender.com`

## Important Notes

⚠️ **Free Tier Limitations on Render:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30 seconds
- Limited resources

✅ **Recommendations:**
- Use Upgrade to "Starter" plan ($7/month) for always-on services
- Use MongoDB Atlas free tier for database (plenty for small projects)
- Set up auto-deploy on GitHub push for easier updates

## Future Deployments

After initial setup, Render will automatically redeploy when you push to GitHub:

```bash
git add .
git commit -m "Update features"
git push origin main
# Render will automatically rebuild and deploy!
```
