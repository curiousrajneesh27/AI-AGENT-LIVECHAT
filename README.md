AI Live Chat Agent
A production-ready, extensible AI-powered customer support chat application built for Spur’s Founding Full‑Stack Engineer take‑home.
The goal: design and ship a realistic slice of Spur’s core product – an AI agent that can handle customer conversations reliably, be easy to extend to new channels, and withstand “real world” misuse.

Live Demo: https://ai-agent-livechat.vercel.app/

1. What This Agent Does
This project simulates a Spur-style AI support agent embedded in a website chat widget for a fictional e‑commerce store.

Users type questions like “What’s your return policy?” or “Do you ship to the USA?” and get contextual, FAQ‑aware answers from an LLM.

Every message (user + AI) is persisted to a SQLite database, associated with a conversation/session so chats can be resumed across reloads.

The backend wraps the LLM behind a clean service boundary, making it easy to swap providers or add tools later.

Input validation, error handling, and guardrails ensure the app behaves well under bad input, API failures, and network issues.

The design mirrors how a founding engineer would build a first version of Spur’s live chat channel, with clear seams to later plug in WhatsApp, Instagram, or other sources.

2. Features
Real AI chat
Uses OpenAI-compatible models (via OpenAI or OpenRouter) with a focused system prompt and conversation history for contextual answers.

Conversation persistence
SQLite database stores conversations and messages so a user can reload and continue where they left off.

Session management
Frontend tracks a sessionId and passes it with every request, mapping neatly to a conversation in the DB.

Clean, minimal chat UI
Modern, responsive chat interface with clear user/agent separation, auto-scroll, and typing indicators.

Robust input validation
Zod-based schemas on the backend enforce non-empty messages, max length, and correct types; frontend blocks obviously invalid input before network calls.

Guardrails & error handling
Central error middleware normalizes LLM, network, and DB errors into user-friendly messages so the app fails gracefully instead of crashing.

Domain knowledge baked in
A knowledge.ts module encapsulates fictional store FAQs (shipping, returns, support, payments, warranty) and feeds this into the LLM prompt so answers are stable and testable.

Production‑style structure
Routes → middleware → services → DB/LLM layers, making it obvious where to add new channels, tools, or business logic.

3. System Architecture
The system is intentionally small but structured like a real product.

High-level flow:

User Browser / Chat Widget

Renders the chat UI, accepts user input, shows AI replies.

Maintains a sessionId in sessionStorage to reuse the same conversation.

Frontend (React + Vite + TypeScript)

Sends POST /api/chat/message with { message, sessionId? } to the backend.

Updates UI optimistically with the user’s message, then appends the AI reply and auto-scrolls.

Shows typing indicator and disables input while waiting for the response.

Backend (Node.js + Express + TypeScript)

Routes layer (routes/chat.ts) exposes:

POST /api/chat/message – send message, get AI reply.

GET /api/chat/history/:conversationId – fetch full message history.

GET /api/chat/health – health check.

Validation middleware (middleware/validation.ts) runs Zod schemas to enforce message length and structure before hitting business logic.

Services layer:

database/services.ts handles conversations/messages CRUD.

llm/service.ts encapsulates prompt construction and LLM calls.

Error middleware (middleware/errorHandler.ts) catches thrown errors and converts them into safe JSON responses.

Database (SQLite via better-sqlite3)

Conversations

id (UUID)

createdAt

Messages

id (UUID)

conversationId (FK)

sender ("user" | "ai")

text

timestamp

A single conversation has many messages; every request persists both sides of the dialogue.

LLM Provider (OpenAI / OpenRouter)

Backend calls the provider through a single generateReply(history, userMessage)-style function.

Uses:

System prompt describing the e‑commerce store and policies.

Truncated conversation history (for cost control) so replies stay in-context.

Timeouts, API key issues, and rate limits are caught and converted to friendly “agent temporarily unavailable” messages.

The attached architecture diagram reflects exactly this flow: browser → frontend → backend (validation, conversation lookup, DB read/write, LLM call) → response back, with explicit error and guardrail paths.
​

4. Tech Stack
Backend

Node.js 18+

TypeScript

Express.js (REST API)

SQLite (better-sqlite3) for persistence

OpenAI-compatible LLM API (OpenAI / OpenRouter)

Zod for schema validation

Layered architecture: routes, middleware, services, infrastructure

Frontend

React 18 + TypeScript

Vite bundler

Custom CSS (no UI framework) for full control over the chat experience

This mirrors a realistic early-stage stack: simple to deploy, easy to reason about, and ready to be split into separate services later if scale demands.

5. Running the Project
5.1. Prerequisites
Node.js 18+

npm or pnpm

An OpenAI or OpenRouter API key

5.2. Clone & Install
bash
git clone <your-repo-url> AI-LIVE-CHAT
cd AI-LIVE-CHAT

# Root scripts
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

cd ..
5.3. Environment Variables (Backend)
Create backend/.env from the example:

bash
cp .env.example backend/.env
Edit backend/.env:

text
OPENAI_API_KEY=sk-your-key-here
PORT=5000
NODE_ENV=development
DATABASE_PATH=./database.sqlite
MODEL=gpt-3.5-turbo
MAX_TOKENS=500
TEMPERATURE=0.7
MAX_MESSAGE_LENGTH=2000
You can also point OPENAI_API_KEY and MODEL to an OpenRouter-compatible model if preferred.

5.4. Start in Development
Option A – one command (root):

bash
npm run dev
Backend: http://localhost:5000

Frontend: http://localhost:3000

Option B – separate terminals

bash
# Terminal 1 – backend
cd backend
npm run dev

# Terminal 2 – frontend
cd frontend
npm run dev
Then open http://localhost:3000 in your browser.

6. API Overview
POST /api/chat/message
Send a new user message and get the AI reply.

Request

json
{
  "message": "What's your return policy?",
  "sessionId": "optional-uuid"
}
Response

json
{
  "success": true,
  "reply": "We offer a 30-day return policy...",
  "sessionId": "uuid",
  "messageId": "uuid",
  "timestamp": "2025-12-21T10:30:00Z"
}
GET /api/chat/history/:conversationId
Fetch full conversation history for a given conversation.

Response

json
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
GET /api/chat/health
Simple health check, useful for uptime checks and deployment verification.

7. Project Structure
text
AI-LIVE-CHAT/
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   ├── db.ts              # SQLite initialization
│   │   │   └── services.ts        # Conversation & message CRUD
│   │   ├── llm/
│   │   │   ├── service.ts         # LLM integration & prompt building
│   │   │   └── knowledge.ts       # Store FAQs & system prompt content
│   │   ├── middleware/
│   │   │   ├── validation.ts      # Zod validation middleware
│   │   │   └── errorHandler.ts    # Central error handling
│   │   ├── routes/
│   │   │   └── chat.ts            # Chat-related endpoints
│   │   ├── validators/
│   │   │   └── schemas.ts         # Zod schemas for requests
│   │   └── index.ts               # Express app bootstrap
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── chat.ts            # API client wrapper
│   │   ├── components/
│   │   │   ├── Message.tsx        # Message bubble
│   │   │   ├── Message.css
│   │   │   ├── TypingIndicator.tsx
│   │   │   └── TypingIndicator.css
│   │   ├── App.tsx                # Main chat experience
│   │   ├── App.css
│   │   ├── main.tsx               # React entry
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
├── package.json                   # Root scripts (concurrent dev, etc.)
├── .env.example
├── .gitignore
└── README.md
This separation makes it straightforward to:

Add new routes (e.g., /api/whatsapp/message) that reuse the same services.

Swap SQLite for PostgreSQL without touching route or UI code.

Replace OpenAI with another provider by editing only the LLM layer.

8. Domain Knowledge & Prompting
The agent is configured as support for a fictional “TechGadget Store”.

Embedded knowledge includes:

Shipping policy
Free shipping above a threshold, standard vs express, typical delivery times.

Return policy
30‑day returns, free for defective items.

Support hours
Weekday support hours and contact methods.

Payment methods & warranty
Major cards, PayPal, Apple Pay, and default manufacturer warranty.

This content lives in llm/knowledge.ts and is injected into the system prompt so responses are consistent and testable. The LLM also receives recent conversation history, enabling follow-up questions like “What about international shipping?” to be answered in context.

9. Error Handling & Resilience
Empty message → rejected by Zod + frontend check with a clear error.

Messages beyond MAX_MESSAGE_LENGTH → blocked with a friendly message.

Invalid / expired API keys → caught in LLM service and surfaced as “agent unavailable” rather than crashing the server.

Rate limits, timeouts, and provider outages → wrapped in a unified error shape by errorHandler.ts.

DB issues → caught and surfaced as 5xx responses, with the UI showing a general error instead of failing silently.

As a founding engineer, the aim is to avoid “one tiny change and everything explodes” by centralizing validation and error handling.

10. Deployment
Backend
Can be deployed to Render, Railway, Fly.io, or any Node host.

Typical configuration:

Build command:
cd backend && npm install && npm run build

Start command:
cd backend && npm start

Environment:

OPENAI_API_KEY

NODE_ENV=production

DATABASE_PATH=/data/database.sqlite (or similar)

Frontend
Optimized for Vercel/Netlify.

Base directory: frontend

Build command: npm run build

Publish directory: frontend/dist

Env:

VITE_API_URL=https://your-backend-domain.com/api

The live demo uses this setup, with the frontend deployed to Vercel and the backend deployed separately.

11. Trade‑offs & “If I Had More Time…”
Made for this assignment

SQLite over PostgreSQL – zero config, ideal for a take‑home; the service layer keeps the migration path to Postgres straightforward.

REST over WebSockets – simpler and enough for request/response style support; streaming and real-time presence can be layered on later.

No Redis – premature for a single-node prototype; left as a clear next step for caching and rate‑limit tracking.

React instead of Svelte – chosen for speed and reliability given existing experience, but the architecture is framework‑agnostic.

Next steps if this were production

Add auth and multi-tenant support so multiple stores can use the same infrastructure.

Introduce role-based tools (refund creation, order lookup) behind the LLM.

Implement LLM streaming for partial responses and better UX.

Add observability: structured logs, metrics, and traces around LLM calls and latency.

Build a Spur-style channel abstraction where web chat, WhatsApp, and Instagram are just different “entry points” into the same conversation + LLM pipeline.

12. Author
Built by Rajneesh Verma as part of Spur’s Founding Full‑Stack Engineer take‑home.
This codebase is written the way it would be as a first slice of a real product: minimal, pragmatic, but with clear extension points for the next 6–12 months of building.
