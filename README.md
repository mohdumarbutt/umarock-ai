# UmaRock AI - Professional AI Chat Application

A sophisticated AI chat application developed by Umar Butt, featuring multiple AI models, advanced chat functionality, and comprehensive user management.

## 🚀 Features

### Core Functionality
- **Multiple AI Models**: DeepSeek R1 0528 (Premium) and DeepSeek R1 Free
- **Real-time Chat**: Streaming responses with typing indicators
- **Authentication System**: Secure user registration and login
- **Chat Memory**: Persistent conversation history with local storage
- **Responsive Design**: Works seamlessly on all devices

### Advanced Chat Features
- **Message Export**: PDF, DOCX, and TXT (Markdown) formats
- **Code Block Copying**: Dedicated copy buttons for code snippets
- **Response Regeneration**: Re-generate last AI response
- **Chat Management**: Pin, bookmark, and favorite conversations
- **Share Functionality**: Share responses as text

### UI/UX Features
- **Theme System**: Dark, Light, and Dark Green themes
- **Developer Credits**: Proper attribution to Umar Butt
- **Social Integration**: Links to developer's social profiles
- **Admin Dashboard**: User management and analytics
- **Customer Support**: Dedicated AI support chat

### Technical Features
- **Backend Proxy**: Secure API key management with Express.js
- **Rate Limiting**: Protection against abuse
- **Error Handling**: Comprehensive error management
- **CORS Support**: Cross-origin resource sharing
- **Environment Configuration**: Secure environment variable management

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables
- **JavaScript (ES6+)** - Modern JavaScript features
- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Icon library
- **Plotly.js** - Interactive charts (admin dashboard)

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Axios** - HTTP client
- **Helmet** - Security middleware
- **CORS** - Cross-origin support
- **Rate Limiting** - Request throttling

### External Services
- **OpenRouter API** - AI model access
- **Firebase Auth** - Authentication (placeholder)
- **Vercel** - Frontend hosting
- **Render.com** - Backend hosting

## 📁 Project Structure

```
umarock-ai/
├── frontend/                 # Frontend application
│   ├── index.html           # Main chat interface
│   ├── auth.html            # Authentication pages
│   ├── admin.html           # Admin dashboard
│   ├── main.js              # Core application logic
│   └── resources/           # Static assets
│       ├── umarock-logo.png
│       └── profile-pic.png
├── backend/                 # Backend API server
│   ├── server.js            # Express server
│   ├── package.json         # Node.js dependencies
│   ├── .env.example         # Environment variables template
│   └── instructions.json    # AI support instructions
├── outline.md               # Project outline
└── README.md               # This file
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- OpenRouter API keys (provided in project files)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd umarock-ai
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual API keys
   ```

4. **Start the backend server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

5. **Start the frontend**
   ```bash
   # Open frontend/index.html in a web browser
   # or serve with a local server
   python -m http.server 8000
   ```

### Environment Variables

#### Backend (.env)
```env
# OpenRouter API Keys
OPENROUTER_API_KEY_1=your_deepseek_r1_0528_key
OPENROUTER_API_KEY_2=your_deepseek_r1_free_key

# Server Configuration
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

## 🔐 Authentication

The application includes a comprehensive authentication system:

- **User Registration**: Email and password signup
- **User Login**: Secure authentication with session management
- **Demo Account**: Pre-configured demo access for testing
- **Password Validation**: Minimum length and complexity requirements
- **Session Storage**: Persistent authentication state

### Demo Credentials
- **Email**: `demo@umarock.ai`
- **Password**: `demo123`

## 🤖 AI Models

### Available Models
1. **DeepSeek R1 0528** (Premium)
   - Advanced capabilities
   - Higher accuracy
   - Paid tier usage

2. **DeepSeek R1 Free** (Free)
   - Basic functionality
   - Rate limited
   - Free tier usage

### Coming Soon Models
- GPT-4 Turbo
- Claude 3 Sonnet
- Gemini Pro

## 📊 Admin Dashboard

The admin dashboard provides comprehensive system management:

### Features
- **User Management**: View, edit, and delete users
- **System Analytics**: Usage statistics and trends
- **Model Configuration**: AI model status and settings
- **System Settings**: Application configuration options
- **Real-time Monitoring**: Live system metrics

### Analytics
- User activity tracking
- Message volume analysis
- Model usage statistics
- Response time monitoring
- API usage metrics

## 🎨 Themes

The application supports three themes:

1. **Dark Theme**: Default professional dark interface
2. **Light Theme**: Clean light interface for bright environments
3. **Dark Green Theme**: Nature-inspired dark green interface

## 📤 Export Options

Users can export conversations in multiple formats:

- **PDF**: Formatted document with styling
- **DOCX**: Microsoft Word compatible format
- **TXT**: Plain text with Markdown formatting

## 🔧 Development

### Code Structure
- **Modular Design**: Separated concerns and reusable components
- **ES6+ Features**: Modern JavaScript syntax and features
- **Async/Await**: Promise-based asynchronous operations
- **Error Handling**: Comprehensive error management
- **Security**: Input validation and sanitization

### Best Practices
- Clean code architecture
- Responsive design principles
- Accessibility considerations
- Performance optimization
- Security best practices

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Configure build settings
3. Set environment variables
4. Deploy automatically on push

### Backend (Render.com)
1. Create new web service on Render
2. Connect GitHub repository
3. Configure build command and start command
4. Set environment variables
5. Deploy automatically on push

### Environment Setup
```bash
# Frontend (Vercel)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id

# Backend (Render)
OPENROUTER_API_KEY_1=your_deepseek_r1_0528_key
OPENROUTER_API_KEY_2=your_deepseek_r1_free_key
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-umarock-ai.vercel.app
```

## 🔒 Security

### Implemented Security Measures
- **API Key Protection**: Backend proxy prevents client-side exposure
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Input Validation**: Sanitizes user inputs
- **CORS Configuration**: Controlled cross-origin access
- **Helmet.js**: Security headers middleware
- **Environment Variables**: Sensitive data protection

### Best Practices
- Never expose API keys in client-side code
- Use HTTPS in production
- Implement proper authentication
- Regular security updates
- Input sanitization and validation

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check API key configuration
   - Verify network connectivity
   - Check rate limits

2. **Authentication Issues**
   - Clear browser cache
   - Check localStorage permissions
   - Verify token validity

3. **Theme Not Loading**
   - Check CSS variable support
   - Verify theme selection logic
   - Clear browser cache

4. **Export Not Working**
   - Check browser permissions
   - Verify required libraries loaded
   - Check file system access

## 🤝 Contributing

This project was developed by Umar Butt. For contributions, issues, or feature requests:

- **GitHub**: [github.com/mohdumarbutt](https://github.com/mohdumarbutt)
- **Email**: Contact through GitHub
- **Issues**: Report bugs and feature requests on GitHub

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Umar Butt** - Project developer and maintainer
- **OpenRouter** - AI model API provider
- **DeepSeek** - AI model provider
- **Open Source Community** - Various libraries and tools

## 📞 Support

For support, questions, or feedback:

- **GitHub Issues**: [Report issues here](https://github.com/mohdumarbutt/umarock-ai/issues)
- **Email**: Contact through GitHub profile
- **Social Media**: Links available in the application

---

**Developed with ❤️ by Umar Butt**  
*Full-stack web/app developer skilled in Python, JS, C++, HTML/CSS. Building scalable apps from frontend to backend. Passionate about Innovative Tech AI.*