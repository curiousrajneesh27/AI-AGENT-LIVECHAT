# AI Live Chat Agent

A production-ready AI-powered customer support chat application built for Spur's Full-Stack Engineer take-home assignment.

🔗 **Live Demo**: [Your deployment URL here]

## Features

✅ **Real-time AI Chat**: Powered by OpenAI's GPT models  
✅ **Conversation Persistence**: SQLite database for message history  
✅ **Session Management**: Resume conversations across page reloads  
✅ **Beautiful UI**: Modern, responsive chat interface  
✅ **Error Handling**: Graceful handling of API failures, timeouts, and edge cases  
✅ **Input Validation**: Prevents empty messages, handles long inputs  
✅ **Domain Knowledge**: Pre-loaded with fictional store FAQs  
✅ **Typing Indicators**: Real-time feedback during AI responses  
✅ **Auto-scroll**: Smooth scrolling to latest messages

## Tech Stack

**Backend:**

- Node.js + TypeScript
- Express.js (REST API)
- SQLite (better-sqlite3) for data persistence
- OpenAI API for LLM integration
- Zod for input validation

**Frontend:**

- React 18 + TypeScript
- Vite (build tool)
- CSS3 (custom styling, no frameworks)

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Quick Start

### 1. Clone and Install

```bash
cd AI-LIVE-CHAT
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example backend/.env
```

Edit `backend/.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=5000
NODE_ENV=development
DATABASE_PATH=./database.sqlite
MODEL=gpt-3.5-turbo
MAX_TOKENS=500
TEMPERATURE=0.7
MAX_MESSAGE_LENGTH=2000
```

### 3. Run the Application

**Option A: Run both servers concurrently (recommended)**

```bash
npm run dev
```

This starts:

- Backend API on `http://localhost:5000`
- Frontend on `http://localhost:3000`

**Option B: Run separately**

Terminal 1 (Backend):

```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):

```bash
cd frontend
npm run dev
```

### 4. Open the App

Navigate to `http://localhost:3000` in your browser.

## Project Structure

```
AI-LIVE-CHAT/
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   ├── db.ts              # Database initialization
│   │   │   └── services.ts        # CRUD operations for conversations & messages
│   │   ├── llm/
│   │   │   ├── service.ts         # OpenAI API integration
│   │   │   └── knowledge.ts       # Store FAQs & system prompt
│   │   ├── middleware/
│   │   │   ├── validation.ts      # Zod validation middleware
│   │   │   └── errorHandler.ts    # Global error handling
│   │   ├── routes/
│   │   │   └── chat.ts            # Chat endpoints
│   │   ├── validators/
│   │   │   └── schemas.ts         # Zod schemas
│   │   └── index.ts               # Express app entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── chat.ts            # API client
│   │   ├── components/
│   │   │   ├── Message.tsx        # Message bubble component
│   │   │   ├── Message.css
│   │   │   ├── TypingIndicator.tsx
│   │   │   └── TypingIndicator.css
│   │   ├── App.tsx                # Main chat component
│   │   ├── App.css
│   │   ├── main.tsx               # React entry point
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
├── package.json                    # Root package for scripts
├── .env.example
├── .gitignore
└── README.md
```

## API Endpoints

### POST `/api/chat/message`

Send a message and receive AI response.

**Request:**

```json
{
  "message": "What's your return policy?",
  "sessionId": "optional-uuid"
}
```

**Response:**

```json
{
  "success": true,
  "reply": "We offer a 30-day return policy...",
  "sessionId": "uuid",
  "messageId": "uuid",
  "timestamp": "2025-12-21T10:30:00Z"
}
```

### GET `/api/chat/history/:conversationId`

Retrieve conversation history.

**Response:**

```json
{
  "success": true,
  "conversationId": "uuid",
  "messages": [
    {
      "id": "uuid",
      "sender": "user",
      "text": "Hello",
      "timestamp": "2025-12-21T10:30:00Z"
    }
  ]
}
```

### GET `/api/chat/health`

Health check endpoint.

## Architecture Decisions

### Backend Architecture

**Layered Design:**

- **Routes**: Handle HTTP requests/responses
- **Services**: Business logic (database, LLM)
- **Middleware**: Validation, error handling
- **Database**: Data persistence layer

**Why SQLite?**

- Zero configuration for development
- Easy migration to PostgreSQL (minimal code changes)
- Perfect for prototypes and single-server deployments

**LLM Integration:**

- Encapsulated in `llm/service.ts` for easy provider switching
- Timeout protection (30 seconds)
- Comprehensive error handling (rate limits, API errors, timeouts)
- Conversation history included for context-aware responses

### Frontend Architecture

**React + TypeScript:**

- Type safety for API contracts
- Component-based architecture for reusability
- Hooks for state management (useState, useEffect, useRef)

**Session Management:**

- Stores session ID in sessionStorage
- Automatically resumes conversations on page reload
- Gracefully handles session not found

**UX Features:**

- Optimistic updates (user messages appear immediately)
- Auto-scroll to latest messages
- Typing indicator during AI processing
- Error messages displayed inline
- Disabled input during loading

## Domain Knowledge

The AI agent is pre-loaded with knowledge about a fictional e-commerce store (TechGadget Store):

- **Shipping Policy**: Free shipping over $50, standard/express options
- **Return Policy**: 30-day returns, free for defects
- **Support Hours**: Mon-Fri 9 AM - 6 PM EST
- **Payment Methods**: Major credit cards, PayPal, Apple Pay, etc.
- **Warranty**: Manufacturer warranty included

Try asking:

- "What's your return policy?"
- "Do you offer free shipping?"
- "What are your support hours?"
- "How long does shipping take?"

## Error Handling

The application handles:

- ❌ Empty messages (frontend + backend validation)
- ❌ Messages exceeding 2000 characters
- ❌ Invalid/expired API keys
- ❌ Rate limiting (429 errors)
- ❌ Network timeouts (30 second limit)
- ❌ LLM service outages
- ❌ Database errors
- ❌ Malformed requests

All errors result in user-friendly messages, never crashes.

## Deployment

### Backend (Render/Railway/Fly.io)

1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables:
   - `OPENAI_API_KEY`
   - `NODE_ENV=production`
   - `PORT` (usually auto-detected)
4. Build command: `cd backend && npm install && npm run build`
5. Start command: `cd backend && npm start`

### Frontend (Vercel/Netlify)

1. Connect your GitHub repository
2. Set build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
3. Environment variables:
   - `VITE_API_URL=https://your-backend-url.com/api`

## Trade-offs & Future Improvements

### If I Had More Time...

**🔐 Authentication & Authorization**

- User accounts and login
- Conversation ownership
- Admin dashboard

**📊 Analytics & Monitoring**

- Track conversation metrics
- User satisfaction ratings
- LLM performance monitoring

**🚀 Performance Optimizations**

- Redis caching for frequent queries
- Connection pooling
- CDN for static assets
- LLM response streaming

**🔌 Additional Integrations**

- Multi-channel support (WhatsApp, Instagram, Facebook)
- CRM integrations (Salesforce, HubSpot)
- E-commerce platforms (Shopify)

**🧪 Testing**

- Unit tests (Jest/Vitest)
- Integration tests
- E2E tests (Playwright)

**🛡️ Security Enhancements**

- Rate limiting per IP
- API key rotation
- Input sanitization against XSS
- CSRF protection

**💬 Advanced Features**

- File uploads (images, documents)
- Rich message formatting (Markdown)
- Agent handoff to human support
- Multi-language support

### Design Decisions Explained

**Why not Redis?**

- Adds deployment complexity
- SQLite is sufficient for this scale
- Easy to add later for session storage

**Why REST over WebSockets?**

- Simpler implementation
- Adequate for current use case
- Polling could be added for real-time updates

**Why gpt-3.5-turbo?**

- Cost-effective for demos
- Fast response times
- Easy to upgrade to GPT-4

**Why not Svelte?**

- React has broader adoption (team velocity)
- Larger ecosystem and community
- Can switch if team prefers Svelte

## Development

### Running Tests

```bash
# Backend tests (when implemented)
cd backend && npm test

# Frontend tests (when implemented)
cd frontend && npm test
```

### Building for Production

```bash
npm run build
```

Builds:

- Backend: `backend/dist/`
- Frontend: `frontend/dist/`

### Linting & Formatting

```bash
# Backend
cd backend && npm run lint

# Frontend
cd frontend && npm run lint
```

## Troubleshooting

**"Invalid API key" error:**

- Check your `.env` file has `OPENAI_API_KEY` set
- Verify the key is active on OpenAI dashboard
- Restart the backend server after changing `.env`

**"Failed to fetch" / CORS errors:**

- Ensure backend is running on port 5000
- Check Vite proxy configuration in `frontend/vite.config.ts`

**Database errors:**

- Delete `backend/database.sqlite` and restart
- Check file permissions in the backend directory

**Port already in use:**

```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## License

MIT

## Author

Built for Spur's Founding Full-Stack Engineer Take-Home Assignment

---

**Estimated Development Time**: ~10 hours

**Last Updated**: December 21, 2025
