# UmaRock AI Deployment Guide

This guide provides step-by-step instructions for deploying the UmaRock AI application to production environments.

## 🚀 Deployment Overview

The UmaRock AI application consists of two main components:

1. **Frontend**: Static HTML/CSS/JavaScript files (deployed to Vercel)
2. **Backend**: Node.js Express server (deployed to Render.com)

## 📋 Prerequisites

Before deploying, ensure you have:

- GitHub account
- Vercel account (free tier available)
- Render.com account (free tier available)
- OpenRouter API keys (provided in the project)
- Basic knowledge of Git and deployment platforms

## 🔧 Environment Setup

### 1. Repository Setup

First, create a new GitHub repository and push your code:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: UmaRock AI Application"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/umarock-ai.git

# Push to GitHub
git push -u origin main
```

### 2. Environment Variables

Create environment files with your actual API keys:

#### Backend Environment (.env)
```env
# OpenRouter API Keys - DeepSeek R1 0528
OPENROUTER_API_KEY_1=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

# OpenRouter API Keys - DeepSeek R1 Free
OPENROUTER_API_KEY_2=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

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL (update this after deploying to Vercel)
FRONTEND_URL=http://localhost:5173
```

## 🌐 Frontend Deployment (Vercel)

### Step 1: Connect to Vercel

1. Visit [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "New Project"
3. Import your UmaRock AI repository
4. Configure the project:
   - **Framework**: Static
   - **Root Directory**: `frontend`
   - **Build Command**: (leave empty)
   - **Output Directory**: `frontend`

### Step 2: Environment Variables

Add the following environment variables in Vercel:

```env
# Firebase Configuration (placeholder - configure with actual Firebase project)
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here

# Backend API URL (update this after deploying backend to Render)
VITE_BACKEND_URL=http://localhost:3000
```

> **Note**: These are placeholder Firebase variables. For production, replace with actual Firebase credentials or remove if not using Firebase.

### Step 3: Deploy

1. Click "Deploy" to start the deployment process
2. Vercel will automatically deploy your frontend
3. Note the deployment URL (e.g., `https://umarock-ai-xyz.vercel.app`)

### Step 4: Update Backend CORS

Update your backend's environment variable with the Vercel URL:

```env
FRONTEND_URL=https://umarock-ai-xyz.vercel.app
```

## 🔧 Backend Deployment (Render.com)

### Step 1: Create New Service

1. Visit [render.com](https://render.com) and sign in
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `umarock-ai-backend`
   - **Environment**: Node
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

### Step 2: Environment Variables

Add the following environment variables in Render:

```env
NODE_ENV=production
PORT=3000
OPENROUTER_API_KEY_1=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
OPENROUTER_API_KEY_2=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
FRONTEND_URL=https://umarock-ai-xyz.vercel.app
```

### Step 3: Deploy

1. Click "Create Web Service" to start deployment
2. Render will automatically build and deploy your backend
3. Note the deployment URL (e.g., `https://umarock-ai-backend.onrender.com`)

## 🔄 Update Frontend API URL

After both deployments are complete, update the frontend to use the backend URL:

### Update frontend/main.js

Find this line in `frontend/main.js`:
```javascript
this.backendUrl = 'http://localhost:3000'; // Will be updated for production
```

Replace with:
```javascript
this.backendUrl = 'https://umarock-ai-backend.onrender.com';
```

### Redeploy Frontend

1. Commit and push the changes to GitHub
2. Vercel will automatically redeploy with the updated backend URL

## 🧪 Testing Deployment

### Test Frontend

1. Visit your Vercel deployment URL
2. Verify the application loads correctly
3. Test authentication (use demo credentials)
4. Test chat functionality
5. Test theme switching
6. Test export features

### Test Backend

1. Test API endpoints:
   ```bash
   curl https://umarock-ai-backend.onrender.com/api/health
   ```

2. Test model listing:
   ```bash
   curl https://umarock-ai-backend.onrender.com/api/models
   ```

3. Test chat API (requires authentication):
   ```bash
   curl -X POST https://umarock-ai-backend.onrender.com/api/chat \
     -H "Content-Type: application/json" \
     -d '{
       "model": "deepseek-r1-free",
       "messages": [{"role": "user", "content": "Hello"}],
       "stream": false
     }'
   ```

## 🔍 Monitoring & Maintenance

### Vercel Analytics
- Monitor frontend performance
- Track user engagement
- Analyze traffic patterns

### Render Monitoring
- Monitor backend health
- Track API response times
- Monitor resource usage

### Application Logs
- Check backend logs in Render dashboard
- Monitor for errors or issues
- Track API usage and performance

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend FRONTEND_URL matches Vercel URL
   - Check CORS configuration in backend/server.js

2. **API Key Issues**
   - Verify API keys are correctly set in Render environment
   - Check API key validity with OpenRouter

3. **Deployment Failures**
   - Check build logs in Vercel/Render dashboards
   - Verify environment variables are set correctly
   - Ensure all files are committed to GitHub

4. **Performance Issues**
   - Monitor API response times
   - Check for rate limiting
   - Optimize frontend assets

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📈 Scaling Considerations

### Performance Optimization
- Enable caching where appropriate
- Optimize images and assets
- Implement CDN for static files
- Monitor and optimize database queries

### Security Hardening
- Implement HTTPS everywhere
- Use strong authentication
- Regular security audits
- Keep dependencies updated

### Cost Management
- Monitor API usage and costs
- Optimize resource allocation
- Use appropriate service tiers
- Implement usage limits

## 📝 Post-Deployment Checklist

- [ ] Frontend deployed successfully on Vercel
- [ ] Backend deployed successfully on Render
- [ ] Environment variables configured correctly
- [ ] API keys working properly
- [ ] CORS configured correctly
- [ ] Authentication working
- [ ] Chat functionality operational
- [ ] Export features working
- [ ] Admin dashboard accessible
- [ ] All themes functioning
- [ ] Mobile responsiveness verified
- [ ] Performance optimized
- [ ] Monitoring setup complete
- [ ] Documentation updated

## 🎉 Success!

Your UmaRock AI application is now live! Share the Vercel URL with users and monitor the application performance.

### Next Steps
1. Share the application with users
2. Monitor usage and performance
3. Gather user feedback
4. Plan future enhancements
5. Keep dependencies updated

---

**Need Help?** Check the [README.md](README.md) for detailed documentation or create an issue on GitHub.