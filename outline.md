# UmaRock AI - Project Outline

## Project Overview
Professional AI Chat Application developed by Umar Butt, featuring multiple AI models, advanced chat functionality, and comprehensive user management.

## File Structure

### Frontend (Vercel Deployment)
```
frontend/
├── index.html          # Main chat interface
├── auth.html           # Authentication (Sign In/Up)
├── admin.html          # Admin dashboard
├── main.js            # Core application logic
├── resources/         # Static assets
│   ├── umarock-logo.png
│   └── profile-pic.png
└── README.md          # Frontend documentation
```

### Backend (Render.com Deployment)
```
backend/
├── server.js          # Express server with API proxy
├── package.json       # Node.js dependencies
├── .env              # Environment variables
├── instructions.json  # AI instructions for customer support
└── README.md         # Backend documentation
```

### Root Files
```
├── .gitignore        # Git ignore rules
├── README.md         # Main project documentation
└── outline.md        # This file
```

## Core Features Implementation

### 1. Authentication System
- Firebase Authentication integration
- Sign In/Sign Up functionality
- Protected routes for authenticated users only
- User session management

### 2. Chat Interface
- Multiple AI models (DeepSeek R1 0528, DeepSeek R1 Free)
- "Coming Soon" indicators for future models
- Real-time chat with streaming responses
- Chat memory system using Firestore
- Message history persistence

### 3. Advanced Chat Features
- Regenerate response functionality
- Export chat options (PDF, DOCX, TXT in markdown)
- Copy full response and code block copying
- Pin chat conversations
- Bookmark individual responses
- Favorite chat sessions
- Share response as text

### 4. UI/UX Features
- Appearance toggle (Dark/Light/Dark Green themes)
- Responsive design for all devices
- Developer credits display
- Social media integration
- Support options

### 5. Customer Support AI
- Separate chat interface for customer support
- AI instructions loaded from instructions.json
- Same DeepSeek API integration
- Specialized system prompts

### 6. Admin Dashboard
- User management
- System monitoring
- Chat analytics
- Administrative controls

## Technical Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Tailwind CSS for styling
- Firebase SDK for authentication
- Fetch API for backend communication
- Local storage for temporary data

### Backend
- Node.js with Express.js
- CORS enabled for cross-origin requests
- Environment variables for sensitive data
- Proxy to OpenRouter API
- Error handling and logging

### APIs and Services
- OpenRouter API (DeepSeek models)
- Firebase Authentication
- Firebase Firestore (for chat storage)
- Vercel (frontend hosting)
- Render.com (backend hosting)

## Environment Variables Required

### Frontend (.env.local for Vercel)
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Backend (.env for Render)
```
OPENROUTER_API_KEY_1=
OPENROUTER_API_KEY_2=
PORT=3000
NODE_ENV=production
```

## Development Phases

1. **Phase 1**: Project setup and structure ✓
2. **Phase 2**: Environment configuration and Firebase setup
3. **Phase 3**: Backend API proxy development
4. **Phase 4**: Authentication system implementation
5. **Phase 5**: Main chat interface development
6. **Phase 6**: Advanced features implementation
7. **Phase 7**: Admin dashboard creation
8. **Phase 8**: Testing and bug fixes
9. **Phase 9**: Deployment and documentation

## Success Criteria
- All authentication flows working
- Chat functionality with both AI models
- All export and sharing features operational
- Responsive design across devices
- Successful deployment to both platforms
- Developer credits properly displayed
- Customer support AI functional