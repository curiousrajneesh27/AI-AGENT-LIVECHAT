# 🏗️ ARCHITECTURE DIAGRAM

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                     http://localhost:3000                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                           │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  App.tsx (Main Component)                              │    │
│  │    - State Management (messages, loading, sessionId)   │    │
│  │    - Event Handlers (send message, new chat)           │    │
│  │                                                         │    │
│  │  ┌────────────┐  ┌─────────────────┐  ┌────────────┐  │    │
│  │  │ Message    │  │ TypingIndicator │  │ Input Form │  │    │
│  │  │ Component  │  │  Component      │  │            │  │    │
│  │  └────────────┘  └─────────────────┘  └────────────┘  │    │
│  └────────────────────────┬───────────────────────────────┘    │
│                           │                                     │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  API Client (chat.ts)                                   │   │
│  │    - sendMessage(message, sessionId)                    │   │
│  │    - getHistory(conversationId)                         │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Vite Proxy (Dev)
                             │ Direct HTTPS (Prod)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND API (Express + TypeScript)             │
│                     http://localhost:5000                        │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Routes Layer (routes/chat.ts)                          │   │
│  │    POST /api/chat/message                               │   │
│  │    GET  /api/chat/history/:conversationId               │   │
│  │    GET  /api/chat/health                                │   │
│  └────────────────────────┬────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Middleware Layer                                       │   │
│  │    - Validation (Zod schemas)                           │   │
│  │    - Error Handling                                     │   │
│  │    - CORS                                               │   │
│  └────────────────────────┬────────────────────────────────┘   │
│                           │                                     │
│         ┌─────────────────┴─────────────────┐                  │
│         ▼                                   ▼                  │
│  ┌──────────────────┐              ┌───────────────────┐      │
│  │  Database Service │              │   LLM Service     │      │
│  │  (services.ts)    │              │  (llm/service.ts) │      │
│  │                   │              │                   │      │
│  │ - create()        │              │ - generateReply() │      │
│  │ - getById()       │              │ - Error handling  │      │
│  │ - getHistory()    │              │ - Timeout control │      │
│  └─────────┬─────────┘              └─────────┬─────────┘      │
│            │                                  │                │
│            ▼                                  ▼                │
│  ┌──────────────────┐              ┌───────────────────┐      │
│  │  SQLite Database │              │   OpenAI API      │      │
│  │  (db.ts)         │              │  GPT-3.5-turbo    │      │
│  │                  │              │                   │      │
│  │ - conversations  │              │ - Chat completion │      │
│  │ - messages       │              │ - Context aware   │      │
│  └──────────────────┘              └───────────────────┘      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Knowledge Base (llm/knowledge.ts)                      │   │
│  │    - Store FAQs                                         │   │
│  │    - System prompt                                      │   │
│  │    - Domain knowledge                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Sending a Message

```
User types message
       ↓
Frontend validates input (not empty, < 2000 chars)
       ↓
API Client: POST /api/chat/message { message, sessionId }
       ↓
Backend: Validation middleware (Zod schema)
       ↓
Route handler:
  1. Get or create conversation
  2. Save user message to DB
  3. Fetch conversation history (last 10 messages)
  4. Call LLM service with history + new message
       ↓
LLM Service:
  1. Build prompt (system + history + user message)
  2. Call OpenAI API
  3. Handle errors (timeout, rate limit, API errors)
  4. Return response or error
       ↓
Route handler:
  5. Save AI response to DB
  6. Return { reply, sessionId, timestamp }
       ↓
Frontend:
  1. Display AI message
  2. Store sessionId in sessionStorage
  3. Enable input for next message
```

## Database Schema

```sql
┌─────────────────────────┐
│    conversations        │
├─────────────────────────┤
│ id (TEXT, PK)          │
│ created_at (DATETIME)  │
│ updated_at (DATETIME)  │
└────────────┬────────────┘
             │
             │ 1:N
             │
┌────────────▼────────────┐
│       messages          │
├─────────────────────────┤
│ id (TEXT, PK)          │
│ conversation_id (FK)   │◄─── Foreign Key
│ sender (TEXT)          │     'user' | 'ai'
│ text (TEXT)            │
│ created_at (DATETIME)  │
└─────────────────────────┘

Indexes:
- idx_messages_conversation_id (fast lookups)
- idx_messages_created_at (sorted queries)
```

## API Endpoints

```
POST /api/chat/message
├── Request:  { message: string, sessionId?: string }
├── Response: { reply: string, sessionId: string, ... }
├── Errors:   400 (validation), 500 (LLM/DB error)
└── Timeout:  30 seconds

GET /api/chat/history/:conversationId
├── Response: { messages: Message[], conversationId: string }
├── Errors:   404 (not found), 500 (DB error)
└── Limit:    50 messages

GET /api/chat/health
├── Response: { status: "healthy", timestamp: string }
└── Purpose:  Monitor uptime
```

## Component Hierarchy

```
App
├── Header
│   ├── Title
│   └── New Chat Button
├── Messages Container (scrollable)
│   ├── Message (user) x N
│   ├── Message (ai) x N
│   ├── TypingIndicator (conditional)
│   └── Error Message (conditional)
└── Input Form
    ├── Textarea
    └── Send Button
```

## State Management

```typescript
// Frontend State (App.tsx)
{
  messages: Message[]           // All conversation messages
  inputValue: string            // Current input text
  isLoading: boolean            // API call in progress
  sessionId: string | undefined // Current conversation ID
  error: string | null          // Error message to display
}

// Session Storage
{
  chatSessionId: string  // Persists across page reloads
}
```

## Error Handling Flow

```
User sends message
       ↓
Frontend validation ───X─→ Show inline error
       ↓ (valid)
API call
       ↓
Backend validation ───X─→ 400 response → Show error
       ↓ (valid)
Database operation ───X─→ 500 response → Show error
       ↓ (success)
LLM API call
       ↓
  ├─→ Timeout (30s) ───X─→ Show "Request timed out"
  ├─→ Rate limit ──────X─→ Show "Too many requests"
  ├─→ Invalid key ─────X─→ Show "Contact support"
  ├─→ API error ───────X─→ Show "Temporarily unavailable"
  └─→ Success ─────────✓─→ Display AI response
```

## Environment Variables

```
Backend (.env)
├── OPENAI_API_KEY        (Required) OpenAI API key
├── PORT                  (Optional) Server port (default: 5000)
├── NODE_ENV              (Optional) development | production
├── DATABASE_PATH         (Optional) SQLite file location
├── MODEL                 (Optional) OpenAI model (default: gpt-3.5-turbo)
├── MAX_TOKENS            (Optional) Response length limit (default: 500)
├── TEMPERATURE           (Optional) AI creativity (default: 0.7)
└── MAX_MESSAGE_LENGTH    (Optional) Input limit (default: 2000)

Frontend (.env)
└── VITE_API_URL          (Optional) Backend URL (default: http://localhost:5000/api)
```

## Deployment Architecture

```
Production Setup:

Frontend (Vercel/Netlify)
       ↓ HTTPS
Backend (Render/Railway)
       ↓ HTTPS
OpenAI API
       ↓
SQLite (Persistent Volume)
  or
PostgreSQL (Managed Database)
```

## Security Considerations

```
✅ Implemented:
- Input validation (Zod)
- CORS configuration
- Environment variable secrets
- SQL injection protection (parameterized queries)
- Error message sanitization (no stack traces in prod)
- Request timeouts

🔒 Production Recommendations:
- Rate limiting (express-rate-limit)
- API key rotation
- HTTPS enforcement
- Content Security Policy
- XSS protection headers
```

## Performance Optimizations

```
Current:
- Database indexes on conversation_id and created_at
- Limited conversation history (last 10 messages to LLM)
- Max token limits (500) for cost control
- Frontend: React.StrictMode for dev checks

Future:
- Redis caching for frequent queries
- LLM response streaming
- Message pagination
- CDN for static assets
- Connection pooling
```

---

This architecture is designed to be:
- ✅ Easy to understand
- ✅ Easy to extend (add more channels, features)
- ✅ Easy to scale (upgrade to PostgreSQL, add Redis)
- ✅ Production-ready (error handling, validation, monitoring)
