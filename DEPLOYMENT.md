# 🚀 Deployment Guide

Climate Risk Assessment Platform - Deployment Instructions

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [GitHub Setup](#github-setup)
- [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
- [Backend Deployment (Render)](#backend-deployment-render)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)

---

## ✅ Prerequisites

- GitHub account with repo access
- Netlify account (connected to GitHub)
- Render.com account
- Node.js 18+ installed locally

---

## 📦 GitHub Setup

### 1. Repository Structure

```
climate-platform/
├── src/                    # React frontend
├── backend/                # Node.js backend
├── public/                 # Static assets
├── netlify.toml           # Netlify config
├── package.json           # Frontend dependencies
└── backend/package.json   # Backend dependencies
```

### 2. Push to GitHub

```bash
# Add all files
git add .

# Commit changes
git commit -m "Deploy: Add mock API system and deployment configs"

# Push to main/master branch
git push origin master
```

---

## 🌐 Frontend Deployment (Netlify)

### Quick Deploy

1. **Go to Netlify Dashboard**
   - https://app.netlify.com

2. **Import from Git**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select repository: `climate-platform`

3. **Build Settings**
   ```
   Base directory: (leave empty)
   Build command: npm install --legacy-peer-deps && CI=false npm run build
   Publish directory: build
   ```

4. **Environment Variables**
   ```
   REACT_APP_USE_MOCK_API=true
   NODE_VERSION=20
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait 2-3 minutes for build

### Site URL
```
https://your-site-name.netlify.app
```

---

## 🖥️ Backend Deployment (Render.com)

### Option 1: Web Service (Recommended)

1. **Go to Render Dashboard**
   - https://dashboard.render.com

2. **New Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Select `climate-platform` repo

3. **Configuration**
   ```
   Name: climate-platform-api
   Region: Choose closest to users
   Branch: master
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Environment Variables** (Add in Render dashboard)
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=your_postgres_url
   JWT_SECRET=your_jwt_secret_here
   CORS_ORIGIN=https://your-netlify-site.netlify.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment

### Backend URL
```
https://climate-platform-api.onrender.com
```

---

## 🔐 Environment Variables

### Frontend (.env for local)

```env
REACT_APP_API_URL=https://climate-platform-api.onrender.com/api/v1
REACT_APP_USE_MOCK_API=false
```

### Backend (.env for local)

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/climate_db
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=30d
CORS_ORIGIN=http://localhost:3000
```

### Production Backend (Render.com)

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=your_render_postgres_url
JWT_SECRET=production-secret-key-change-this
JWT_EXPIRE=30d
CORS_ORIGIN=https://your-netlify-site.netlify.app
```

---

## 📊 Database Setup (Render PostgreSQL)

### Option 1: Render PostgreSQL (Free)

1. **Create Database**
   - In Render dashboard → "New +" → "PostgreSQL"
   - Name: `climate-platform-db`
   - Region: Same as backend
   - Instance: Free

2. **Get Connection String**
   - Copy "Internal Database URL"
   - Add to backend environment variables as `DATABASE_URL`

3. **Run Migrations**
   ```bash
   # Connect to Render shell
   # Or run locally pointing to Render DB
   npm run migrate
   ```

---

## 🔗 Connecting Frontend to Backend

### Update Frontend Environment

1. **In Netlify Dashboard**
   - Site settings → Environment variables
   - Add/Update:
     ```
     REACT_APP_API_URL=https://climate-platform-api.onrender.com/api/v1
     REACT_APP_USE_MOCK_API=false
     ```

2. **Redeploy Frontend**
   - Deploys → Trigger deploy → Clear cache and deploy

---

## ✨ Post-Deployment Checklist

- [ ] Frontend loads at Netlify URL
- [ ] Backend health check responds: `https://your-backend.onrender.com/health`
- [ ] CORS configured correctly
- [ ] Database migrations ran successfully
- [ ] Can register new user
- [ ] Can login with test account
- [ ] Dashboard loads data
- [ ] New assessment form works
- [ ] Organization settings accessible

---

## 🧪 Testing Deployed App

### 1. Health Check
```bash
curl https://climate-platform-api.onrender.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Climate Platform API is running",
  "timestamp": "2025-01-06T..."
}
```

### 2. Test Mock Mode (Frontend only)
- Visit Netlify URL
- Should see console: "🎭 MOCK MODE ENABLED"
- Login: `admin@climate.com` / `admin123`

### 3. Test Real Backend
- Update Netlify env: `REACT_APP_USE_MOCK_API=false`
- Register new user
- Create assessment

---

## 🐛 Troubleshooting

### Frontend Issues

**Build fails on Netlify**
```bash
# Clear cache and retry
# Check Node version matches (20)
# Verify all dependencies in package.json
```

**CORS errors**
```javascript
// Backend: Verify CORS_ORIGIN matches Netlify URL
// Check backend/src/app.js cors configuration
```

### Backend Issues

**Port binding error on Render**
```javascript
// Ensure using process.env.PORT (Render assigns dynamically)
const PORT = process.env.PORT || 5000;
```

**Database connection fails**
```sql
-- Verify DATABASE_URL format
-- Check Render PostgreSQL status
-- Ensure migrations ran
```

**Cold starts (Free tier)**
```
Render free tier spins down after 15 min inactivity
First request after idle: ~30-60 seconds
Consider upgrading to paid tier for production
```

---

## 🔄 Continuous Deployment

### Automatic Deploys

**Netlify** (Frontend)
- ✅ Auto-deploys on push to `master`
- Build time: ~2-3 minutes
- Zero downtime

**Render** (Backend)
- ✅ Auto-deploys on push to `master`
- Build time: ~3-5 minutes
- Zero downtime (with paid tier)

### Manual Deploy

**Netlify**
```bash
# Via dashboard: Deploys → Trigger deploy
```

**Render**
```bash
# Via dashboard: Manual Deploy → Deploy latest commit
```

---

## 📈 Monitoring

### Netlify Analytics
- Site analytics → View traffic
- Deploy logs → Check build errors
- Functions logs (if using)

### Render Logs
- Logs → View real-time logs
- Metrics → CPU/Memory usage
- Events → Deploy history

---

## 💰 Cost Estimate

### Free Tier

| Service | Plan | Limits |
|---------|------|--------|
| Netlify | Free | 100GB bandwidth/month, 300 build minutes |
| Render | Free | 750 hours/month, spins down after 15min idle |
| Render PostgreSQL | Free | 1GB storage, shared CPU |

**Total: $0/month** ✅

### Recommended Production (Paid)

| Service | Plan | Cost |
|---------|------|------|
| Netlify | Pro | $19/month |
| Render Web Service | Starter | $7/month |
| Render PostgreSQL | Basic | $7/month |

**Total: ~$33/month**

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] Database credentials are secure
- [ ] CORS origins are whitelisted
- [ ] HTTPS enforced (automatic on Netlify/Render)
- [ ] Environment variables not in code
- [ ] API rate limiting enabled
- [ ] Input validation on all endpoints

---

## 📞 Support

**Issues**
- GitHub: Open issue in repository
- Email: [your-email]

**Documentation**
- Netlify Docs: https://docs.netlify.com
- Render Docs: https://render.com/docs

---

## 🎉 Success!

Your Climate Risk Assessment Platform is now live! 🌍

**Live URLs**:
- Frontend: `https://your-site.netlify.app`
- Backend: `https://climate-platform-api.onrender.com`
- Docs: Check this DEPLOYMENT.md

**Test Credentials** (Mock Mode):
```
Email: admin@climate.com
Password: admin123
```

---

*Last Updated: 2025-01-06*
*Version: 1.0.0*
