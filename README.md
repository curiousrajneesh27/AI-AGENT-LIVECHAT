🤖 AI Live Chat Agent

Production-ready AI-powered customer support chat application
Built with enterprise-grade architecture, conversation persistence, and real-time AI responses.

🔗 Live Demo: https://ai-agent-livechat.vercel.app/

👨‍💻 Author: Rajneesh Verma
🕒 Development Time: ~8 hours
📅 Last Updated: December 23, 2025

✨ Preview & Architecture
📋 Table of Contents

Overview

System Architecture

Features

Tech Stack

Quick Start

Project Structure

API Reference

Domain Knowledge

Error Handling

Deployment

Architecture Decisions

Future Improvements

Troubleshooting

🎯 Overview

AI Live Chat Agent is a full-stack AI-powered customer support system designed with scalability, reliability, and clean architecture in mind.

It demonstrates:

Persistent conversations

Session-based chat continuity

Robust backend validation

Seamless LLM integration

Production-level error handling

This project was built as part of Spur’s Full-Stack Engineer Assessment and follows real-world engineering best practices.

🏗️ System Architecture
High-Level Design

The system follows a three-tier architecture:

┌───────────────┐      HTTP       ┌──────────────────┐      API      ┌───────────────┐
│   Frontend    │ ─────────────▶ │   Backend API     │ ───────────▶ │  LLM Provider │
│  (React + TS) │ ◀───────────── │ (Express + TS)    │ ◀─────────── │ OpenAI/Claude │
└───────────────┘      JSON       └──────────────────┘              └───────────────┘
                                 │
                                 ▼
                         ┌──────────────────┐
                         │   SQLite DB       │
                         │ Conversations    │
                         │ Messages         │
                         └──────────────────┘

🧭 Request Flow (User Message Journey)

Frontend

User sends message

Session ID maintained in browser

Optimistic UI update + typing indicator

Backend

Input validation (Zod)

Conversation lookup / creation

Message persistence

LLM Layer

Context building (system prompt + history)

Timeout & retry logic

AI response generation

Response

AI message stored

UI updated

Auto-scroll + typing indicator removed

✨ Features
✅ Core Features
Feature	Description
💬 Real-time AI Chat	Powered by GPT models
💾 Conversation Persistence	SQLite-backed storage
🔁 Session Management	Resume chats across reloads
🎨 Beautiful UI	Responsive, animated, modern
🛡️ Error Handling	Graceful degradation
📐 Input Validation	Client + server side
📚 Domain Knowledge	Pre-loaded FAQs
⌛ Typing Indicator	Real-time feedback
🔽 Auto Scroll	Always shows latest message
⚡ Advanced Capabilities
Capability	Status
🔒 Security	Input sanitization, CORS
⚡ Performance	Optimized DB queries
🛡️ Reliability	Retries, timeouts
📊 Observability	Structured logging
🛠️ Tech Stack
Backend

Node.js 18+

TypeScript

Express.js

SQLite (better-sqlite3)

OpenAI / OpenRouter

Zod for validation

Frontend

React 18

TypeScript

Vite

Custom CSS (no frameworks)

Fetch API

🚀 Quick Start
Prerequisites

Node.js 18+

OpenAI or OpenRouter API key

Installation
git clone <your-repo-url>
cd AI-LIVE-CHAT

npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

Configuration

Create .env inside backend/:

OPENAI_API_KEY=sk-your-api-key
PORT=5000
NODE_ENV=development
DATABASE_PATH=./database.sqlite
MODEL=gpt-3.5-turbo
MAX_TOKENS=500
TEMPERATURE=0.7
MAX_MESSAGE_LENGTH=2000

Run Locally
npm run dev


Frontend → http://localhost:3000

Backend → http://localhost:5000

📁 Project Structure
AI-LIVE-CHAT/
├── backend/
│   ├── database/
│   ├── llm/
│   ├── middleware/
│   ├── routes/
│   └── index.ts
├── frontend/
│   ├── components/
│   ├── api/
│   └── App.tsx
├── docs/
├── README.md

📡 API Reference
POST /api/chat/message
{
  "message": "What's your return policy?",
  "sessionId": "optional-uuid"
}


Response

{
  "success": true,
  "reply": "We offer a 30-day return policy...",
  "sessionId": "uuid",
  "timestamp": "ISO_DATE"
}

📚 Domain Knowledge

Preloaded with TechGadget Store FAQs:

Shipping

Returns

Payments

Support hours

Warranty

🛡️ Error Handling

Handled gracefully:

Validation errors

API failures

Rate limits

Timeouts

DB issues

Standard error format:

{
  "success": false,
  "error": "Human-readable message",
  "code": "ERROR_CODE"
}

🚢 Deployment
Frontend (Vercel)

Framework: Vite

Output: frontend/dist

Env:

VITE_API_URL=https://your-backend-url.com/api

Backend (Render / Railway)

Persistent volume for SQLite

Production-ready env config

🤔 Architecture Decisions

SQLite → Simple, ACID, fast for single-server

REST over WebSockets → Easier debugging

GPT-3.5 Turbo → Fast, cost-effective

TypeScript → Safer, scalable codebase

🔮 Future Improvements

High Priority

Authentication (JWT)

Redis caching

Streaming responses

Test coverage

Medium

WhatsApp / Email support

Analytics dashboard

Sentiment analysis

Low

Voice input

Multi-language support

CRM integrations

🤝 Contributing

PRs welcome 🙌
Follow clean commits, add tests, update docs.

📄 License

MIT License

<div align="center">

Built with ❤️ for Spur’s Full-Stack Engineer Assessment
If you liked this project — ⭐ star the repo!

</div>
