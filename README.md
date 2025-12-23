<div align="center">

# 🤖 AI Live Chat Agent

**Production-ready AI-powered customer support chat application**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit-00C7B7?style=flat&logo=vercel)](https://ai-agent-livechat.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=flat&logo=github)](https://github.com/curiousrajneesh27/AI-AGENT-LIVECHAT)

Built with Node.js • TypeScript • React • Express • SQLite

</div>

---

## 📋 Overview

A full-stack AI chat application with conversation persistence, session management, and intelligent response generation using OpenAI/OpenRouter APIs. Built with clean architecture, comprehensive error handling, and production-ready practices.

**Key Highlights:**

- Real-time AI responses with context awareness
- Persistent conversations using SQLite
- Session-based chat continuity
- Input validation (client + server)
- Beautiful, responsive UI

---

## ✨ Features

| Feature            | Description                                     |
| :----------------- | :---------------------------------------------- |
| 💬 **AI Chat**     | GPT-powered responses with conversation history |
| 💾 **Persistence** | SQLite database for message storage             |
| 🔁 **Sessions**    | Resume conversations across page reloads        |
| 🛡️ **Validation**  | Zod schema validation on backend                |
| 🎨 **Modern UI**   | Responsive design with typing indicators        |
| ⚡ **Performance** | Optimized queries with database indexes         |
| 🔒 **Security**    | Input sanitization, CORS, environment secrets   |

---

## 🏗️ System Architecture

![Uploading diagram-export-12-23-2025-4_55_10-PM.png…]()




## ✨ Features

<div align="center">

| Feature                         | Description                                      | Status |
| :------------------------------ | :----------------------------------------------- | :----: |
| 💬 **Real-time AI Chat**        | GPT-powered responses with context awareness     |   ✅   |
| 💾 **Persistent Conversations** | SQLite-backed storage with full history          |   ✅   |
| 🔁 **Session Management**       | Resume chats across page reloads                 |   ✅   |
| 🎨 **Beautiful UI**             | Modern, responsive, animated interface           |   ✅   |
| 🛡️ **Error Handling**           | Graceful degradation with user-friendly messages |   ✅   |
| 📐 **Input Validation**         | Client-side + server-side (Zod) validation       |   ✅   |
| 📚 **Domain Knowledge**         | Pre-loaded TechGadget Store FAQs                 |   ✅   |
| ⌛ **Typing Indicator**         | Real-time "AI is typing..." feedback             |   ✅   |
| 🔽 **Auto Scroll**              | Smooth scroll to latest message                  |   ✅   |
| 🔒 **Security**                 | Input sanitization, CORS, env secrets            |   ✅   |
| ⚡ **Performance**              | Indexed DB queries, optimized re-renders         |   ✅   |
| 🔄 **Retry Logic**              | Exponential backoff for failed requests          |   ✅   |

</div>

---

## 🏗️ System Architecture

<div align="center">

### **Three-Tier Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React 18 + TypeScript + Vite                            │   │
│  │  • Chat UI Widget                                        │   │
│  │  • Session Management (sessionStorage)                   │   │
│  │  • API Client (Fetch + Retry Logic)                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────────┘
                        │ HTTPS (JSON)
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Node.js + Express + TypeScript                          │   │
│  │  • REST API Endpoints                                    │   │
│  │  • Zod Validation Middleware                             │   │
│  │  • Business Logic Services                               │   │
│  │  • LLM Integration (OpenRouter)                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────────┘
                        │
           ┌────────────┴────────────┐
           ↓                         ↓
┌──────────────────────┐  ┌──────────────────────┐
│    DATA LAYER        │  │   EXTERNAL SERVICES  │
│  ┌────────────────┐  │  │  ┌────────────────┐  │
│  │  SQLite DB     │  │  │  │  OpenRouter    │  │
│  │  • Conversations│  │  │  │  GPT-3.5-turbo │  │
│  │  • Messages    │  │  │  │  (LLM Provider)│  │
│  │  • Indexes     │  │  │  └────────────────┘  │
│  └────────────────┘  │  └──────────────────────┘
└──────────────────────┘
```

</div>

<details>
<summary><b>🔍 Click to see detailed request flow</b></summary>

### **Message Journey: User → AI → User**

```
Step 1: User Input
   │
   ├─→ Frontend validates message (not empty, < 2000 chars)
   │
   └─→ POST /api/chat/message { message, sessionId }

Step 2: Backend Processing
   │
   ├─→ Zod validation (schema check)
   ├─→ Find or create conversation
   ├─→ Save user message to DB
   ├─→ Fetch last 10 messages (context)
   │
   └─→ Call LLM API (OpenRouter)
       │
       ├─→ System prompt + conversation history
       ├─→ GPT-3.5-turbo generates response
       └─→ Handle errors (timeout, rate limit, API errors)

Step 3: Response Handling
   │
   ├─→ Save AI message to DB
   ├─→ Return JSON response { reply, sessionId, timestamp }
   │
   └─→ Frontend displays message + hides typing indicator
```

</details>

---

## 🛠️ Tech Stack

<table>
<tr>
<td width="50%" valign="top">

### **Backend**

| Technology                                                                                                | Version | Purpose            |
| :-------------------------------------------------------------------------------------------------------- | :-----: | :----------------- |
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white)          |   18+   | JavaScript runtime |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) |  5.3+   | Type safety        |
| ![Express](https://img.shields.io/badge/-Express-000000?style=flat&logo=express&logoColor=white)          |  4.18+  | Web framework      |
| ![SQLite](https://img.shields.io/badge/-SQLite-003B57?style=flat&logo=sqlite&logoColor=white)             |  5.1+   | Database           |
| ![Zod](https://img.shields.io/badge/-Zod-3E67B1?style=flat)                                               |  3.22+  | Validation         |

</td>
<td width="50%" valign="top">

### **Frontend**

| Technology                                                                                                | Version | Purpose      |
| :-------------------------------------------------------------------------------------------------------- | :-----: | :----------- |
| ![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black)                |  18.2+  | UI framework |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) |  5.3+   | Type safety  |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat&logo=vite&logoColor=white)                   |  5.0+   | Build tool   |
| ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat&logo=css3&logoColor=white)                   |    -    | Styling      |

</td>
</tr>
</table>

<div align="center">

### **Deployment & DevOps**

[![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=flat&logo=render&logoColor=white)](https://render.com/)
[![GitHub](https://img.shields.io/badge/GitHub-CI/CD-181717?style=flat&logo=github&logoColor=white)](https://github.com/)

</div>

---

## 🚀 Quick Start

### **Prerequisites**

```bash
✓ Node.js 18+ and npm
✓ Git
✓ OpenRouter API Key (get one at openrouter.ai)
```

### **Installation**

```bash
# 1. Clone the repository
git clone https://github.com/curiousrajneesh27/AI-AGENT-LIVECHAT.git
cd AI-AGENT-LIVECHAT

# 2. Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# 3. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env and add your OpenRouter API key

# 4. Run the application
npm run dev
```

<div align="center">

**🎉 That's it! Your app is now running:**

🔹 Frontend: [http://localhost:3000](http://localhost:3000)  
🔹 Backend: [http://localhost:5000](http://localhost:5000)  
🔹 Health Check: [http://localhost:5000/api/chat/health](http://localhost:5000/api/chat/health)

</div>

---

## 📚 API Endpoints

### POST /api/chat/message

Send a message and receive AI response

**Request:**

```json
{
  "message": "Your question here",
  "sessionId": "optional-uuid"
}
```

**Response:**

```json
{
  "success": true,
  "reply": "AI response",
  "sessionId": "uuid",
  "messageId": "uuid",
  "timestamp": "ISO-8601"
}
```

### GET /api/chat/history/:conversationId

Retrieve conversation history

### GET /api/chat/health

Check system status and health

### DELETE /api/chat/conversation/:id

Delete a conversation

> For detailed API documentation, see [COMPREHENSIVE_README.md](./COMPREHENSIVE_README.md)

---

## 📁 Project Structure

```
AI-AGENT-LIVECHAT/
├── 📂 backend/
│   ├── 📂 src/
│   │   ├── 📂 database/
│   │   │   ├── db.ts              # Database setup & schema
│   │   │   └── services.ts        # CRUD operations
│   │   ├── 📂 llm/
│   │   │   ├── service.ts         # OpenRouter integration
│   │   │   └── knowledge.ts       # Domain FAQs
│   │   ├── 📂 middleware/
│   │   │   ├── validation.ts      # Zod validators
│   │   │   └── errorHandler.ts    # Error middleware
│   │   ├── 📂 routes/
│   │   │   └── chat.ts            # API endpoints
│   │   └── index.ts               # Express server
│   └── package.json
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 api/
│   │   │   └── chat.ts            # API client
│   │   ├── 📂 components/
│   │   │   ├── Message.tsx        # Message bubble
│   │   │   └── TypingIndicator.tsx
│   │   ├── App.tsx                # Main chat app
│   │   └── main.tsx
│   └── package.json
├── 📄 README.md                    # This file
├── 📄 COMPREHENSIVE_README.md      # Full technical docs
└── 📄 DEPLOYMENT.md                # Deployment guide
```

---

## 🌐 Deployment

### Frontend (Vercel)

1. Connect GitHub repository
2. Set root directory: `frontend/`
3. Build command: `npm run build`
4. Output directory: `dist/`
5. Add environment variable: `VITE_API_URL`

### Backend (Render)

1. Connect GitHub repository
2. Set root directory: `backend/`
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add environment variables (see backend/.env.example)

**Live Application:**

- Frontend: https://ai-agent-livechat.vercel.app
- Backend: https://ai-agent-livechat.onrender.com

> For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## � License

MIT License - Free to use, modify, and distribute.

---

## 📚 Additional Documentation

- [COMPREHENSIVE_README.md](./COMPREHENSIVE_README.md) - Detailed technical documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Step-by-step deployment guide
- [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) - System architecture details

---

**Built with React, TypeScript, Node.js, Express, and OpenRouter AI**
