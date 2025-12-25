import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './database/db';
import { validateLLMConfig } from './llm/service';
import chatRoutes from './routes/chat';
import authRoutes from './routes/auth';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Load environment variables from .env file
dotenv.config();

// Validate configuration
if (!validateLLMConfig()) {
  console.error('❌ Invalid configuration. Please check your .env file.');
  process.exit(1);
}

// Initialize Express app
const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Live Chat API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/chat/health',
      sendMessage: 'POST /api/chat/message',
      getHistory: 'GET /api/chat/history/:conversationId',
    },
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log('=================================');
      console.log('🚀 AI Live Chat Server Started');
      console.log('=================================');
      console.log(`📡 Server running on: http://localhost:${PORT}`);
      console.log(`🤖 LLM Model: ${process.env.MODEL || 'gpt-3.5-turbo'}`);
      console.log(`📊 Database: ${process.env.DATABASE_PATH || 'database.sqlite'}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
