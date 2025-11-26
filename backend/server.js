const express = require('express');
const cors = require('cors');
const axios = require('axios');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://umarock-ai.vercel.app',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// API Models Configuration
const MODELS = {
  'deepseek-r1-0528': {
    apiKey: process.env.OPENROUTER_API_KEY_1,
    model: 'deepseek/deepseek-r1-0528'
  },
  'deepseek-r1-free': {
    apiKey: process.env.OPENROUTER_API_KEY_2,
    model: 'deepseek/deepseek-r1-free'
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Chat completion endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { model, messages, stream = false, temperature = 0.7 } = req.body;
    
    if (!model || !MODELS[model]) {
      return res.status(400).json({ error: 'Invalid or missing model' });
    }

    const modelConfig = MODELS[model];
    
    const requestBody = {
      model: modelConfig.model,
      messages: messages,
      temperature: temperature,
      stream: stream
    };

    if (stream) {
      // Handle streaming response
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', 
          requestBody,
          {
            headers: {
              'Authorization': `Bearer ${modelConfig.apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
              'X-Title': 'UmaRock AI'
            },
            responseType: 'stream'
          }
        );

        response.data.on('data', (chunk) => {
          const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                res.write(`data: ${data}\n\n`);
                continue;
              }
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';
                if (content) {
                  res.write(`data: ${JSON.stringify({ content })}\n\n`);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        });

        response.data.on('end', () => {
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          res.end();
        });

        response.data.on('error', (error) => {
          console.error('Stream error:', error);
          res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
          res.end();
        });

      } catch (error) {
        console.error('Streaming request error:', error);
        res.status(500).json({ error: 'Failed to process streaming request' });
      }
    } else {
      // Handle non-streaming response
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', 
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${modelConfig.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
            'X-Title': 'UmaRock AI'
          }
        }
      );

      res.json(response.data);
    }
  } catch (error) {
    console.error('Chat API error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      details: error.response?.data?.error || error.message 
    });
  }
});

// Get available models
app.get('/api/models', (req, res) => {
  const availableModels = Object.keys(MODELS).map(key => ({
    id: key,
    name: key.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: key.includes('free') ? 'Free tier model' : 'Premium model',
    status: 'active'
  }));

  // Add coming soon models
  const comingSoonModels = [
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Coming soon', status: 'coming-soon' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Coming soon', status: 'coming-soon' },
    { id: 'gemini-pro', name: 'Gemini Pro', description: 'Coming soon', status: 'coming-soon' }
  ];

  res.json([...availableModels, ...comingSoonModels]);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`UmaRock AI Backend running on port ${PORT}`);
  console.log('Available models:', Object.keys(MODELS));
});