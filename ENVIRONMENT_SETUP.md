# Environment Files Setup

This document describes the environment files created for the UmaRock AI project.

## 🔧 Backend Environment (.env)

**File**: `backend/.env

**Contents**:
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

**Security Note**: These are the actual API keys provided in your PDF document. They are included here for immediate development and testing. For production deployment, ensure these are properly configured in your hosting platform's environment variables.

## 🌐 Frontend Environment (.env.local)

**File**: `frontend/.env.local`

**Contents**:
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

**Note**: The frontend uses environment variables for flexible backend URL configuration.

## 🔍 Implementation Details

### Backend Integration
- The backend server reads API keys from the `.env` file
- CORS is configured to accept requests from the specified frontend URL
- Environment variables are loaded using the `dotenv` package

### Frontend Integration  
- The frontend uses `import.meta.env` to access environment variables
- Backend URL is dynamically configured based on environment
- Supports both development (localhost) and production environments

### Security Considerations
1. **API Key Protection**: Keys are stored in backend environment, not exposed to frontend
2. **Environment Separation**: Different configurations for dev/prod environments  
3. **Git Ignore**: Environment files are excluded from version control
4. **Placeholder Values**: Non-sensitive variables use placeholder values

## 🚀 Production Deployment

When deploying to production:

1. **Backend (Render.com)**:
   - Set environment variables in Render dashboard
   - Update `FRONTEND_URL` to your Vercel deployment URL
   - Change `NODE_ENV` to `production`

2. **Frontend (Vercel)**:
   - Set environment variables in Vercel dashboard
   - Update `VITE_BACKEND_URL` to your Render deployment URL
   - Configure Firebase variables if using Firebase authentication

3. **Update Frontend Code**:
   - The frontend automatically uses the environment variables
   - No code changes needed for URL switching

## 📝 Usage Instructions

### For Development
1. Start backend: `cd backend && npm start`
2. Start frontend: Serve `frontend/index.html` with local server
3. Environment variables will be automatically loaded

### For Production
1. Deploy backend to Render.com with environment variables
2. Deploy frontend to Vercel with environment variables  
3. Update URLs in both environments to match deployments
4. Test all functionality in production environment

## ⚠️ Important Notes

- **API Keys**: The provided API keys are from your PDF document and are included for immediate use
- **Security**: Never commit actual API keys to public repositories
- **Environment**: Always use environment variables for sensitive configuration
- **Testing**: Test thoroughly in development before deploying to production

## 🔧 Troubleshooting

If environment variables are not loading:
1. Ensure `.env` files are in correct directories
2. Restart the server after making changes
3. Check file permissions and encoding
4. Verify environment variable names match code references

---

The environment setup is now complete and ready for both development and production use!