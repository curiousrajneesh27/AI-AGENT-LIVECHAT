<div align="center">

# 🤖 AI Live Chat Agent

### _Production-Ready AI-Powered Customer Support_

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_App-00C7B7?style=for-the-badge)](https://ai-agent-livechat.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/curiousrajneesh27/AI-AGENT-LIVECHAT)
[![Documentation](https://img.shields.io/badge/📖_Docs-Read_More-blue?style=for-the-badge)](https://github.com/curiousrajneesh27/AI-AGENT-LIVECHAT/blob/main/COMPREHENSIVE_README.md)

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](LICENSE)

**Enterprise-grade architecture • Conversation persistence • Real-time AI responses**

[✨ Features](#-features) • [🚀 Quick Start](#-quick-start) • [📚 API Docs](#-api-reference) • [🏗️ Architecture](#-system-architecture) • [🌐 Deploy](#-deployment)

---

![AI Chat Demo](https://img.shields.io/badge/✨_Interactive_Chat_UI-Responsive_Design-purple?style=for-the-badge)
![Real-time Responses](https://img.shields.io/badge/⚡_Real--time_AI-GPT_Powered-orange?style=for-the-badge)
![Session Persistence](https://img.shields.io/badge/💾_Smart_Sessions-Auto_Resume-blue?style=for-the-badge)

</div>

---

## 💫 What Makes This Special?

<table>
<tr>
<td width="50%" valign="top">

### 🏗️ **Enterprise Architecture**

```
✓ Clean 3-tier separation
✓ Type-safe TypeScript codebase
✓ RESTful API design
✓ ACID-compliant SQLite
✓ Dependency injection ready
```

</td>
<td width="50%" valign="top">

### 🚀 **Production Ready**

```
✓ Comprehensive error handling
✓ Input validation (client + server)
✓ Session management
✓ Performance optimized
✓ Docker ready
```

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 💬 **Smart AI Integration**

```
✓ Context-aware responses
✓ Conversation history (last 10)
✓ Domain knowledge (TechGadget FAQs)
✓ Timeout protection (30s)
✓ Retry logic with exponential backoff
```

</td>
<td width="50%" valign="top">

### 🎨 **Beautiful UX**

```
✓ Modern, responsive UI
✓ Real-time typing indicators
✓ Auto-scroll to latest
✓ Smooth animations
✓ Mobile-optimized
```

</td>
</tr>
</table>

---

## 🌟 Project Stats

<div align="center">

|                     👨‍💻 **Author**                      | 🕒 **Dev Time** | 📅 **Updated** |                                                                            ⭐ **Stars**                                                                             |                                                                               🔗 **Forks**                                                                               |
| :----------------------------------------------------: | :-------------: | :------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| [Rajneesh Verma](https://github.com/curiousrajneesh27) |    ~8 hours     |  Dec 23, 2025  | [![Stars](https://img.shields.io/github/stars/curiousrajneesh27/AI-AGENT-LIVECHAT?style=social)](https://github.com/curiousrajneesh27/AI-AGENT-LIVECHAT/stargazers) | [![Forks](https://img.shields.io/github/forks/curiousrajneesh27/AI-AGENT-LIVECHAT?style=social)](https://github.com/curiousrajneesh27/AI-AGENT-LIVECHAT/network/members) |

</div>

---

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

## 📚 API Reference

<details>
<summary><b>📌 POST /api/chat/message</b> - Send message & get AI reply</summary>

**Request:**

```json
{
  "message": "What's your return policy?",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000" // optional
}
```

**Response:**

```json
{
  "success": true,
  "reply": "We offer a 30-day return policy...",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "messageId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "timestamp": "2025-12-23T10:30:45.123Z",
  "metadata": {
    "responseTime": 1234,
    "tokensUsed": 150,
    "model": "openai/gpt-3.5-turbo"
  }
}
```

</details>

<details>
<summary><b>📌 GET /api/chat/history/:conversationId</b> - Get conversation history</summary>

**Response:**

```json
{
  "success": true,
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "messageCount": 4,
  "messages": [
    {
      "id": "...",
      "sender": "user",
      "text": "Hello",
      "timestamp": "2025-12-23T10:30:00.000Z"
    }
  ]
}
```

</details>

<details>
<summary><b>📌 GET /api/chat/health</b> - System health check</summary>

**Response:**

```json
{
  "success": true,
  "status": "healthy",
  "system": {
    "llm": {
      "model": "openai/gpt-3.5-turbo",
      "provider": "openrouter"
    },
    "database": "connected",
    "uptime": 86400,
    "memory": { "used": 45, "total": 512 }
  }
}
```

</details>

<div align="center">

📖 **Full API Documentation**: [COMPREHENSIVE_README.md](./COMPREHENSIVE_README.md#-api-endpoints-documentation)

</div>

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

<table>
<tr>
<td width="50%" valign="top">

### **🎨 Frontend (Vercel)**

```bash
# Auto-deploy from GitHub
1. Connect repository
2. Root: frontend/
3. Build: npm run build
4. Output: dist/
5. Env: VITE_API_URL
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/curiousrajneesh27/AI-AGENT-LIVECHAT)

</td>
<td width="50%" valign="top">

### **⚙️ Backend (Render)**

```bash
# Auto-deploy from GitHub
1. Connect repository
2. Root: backend/
3. Build: npm install && npm run build
4. Start: npm start
5. Env: OPENROUTER_API_KEY
```

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

</td>
</tr>
</table>

<div align="center">

📖 **Detailed deployment guide**: [DEPLOYMENT.md](./DEPLOYMENT.md) • [DEPLOY_NOW.md](./DEPLOY_NOW.md)

</div>

---

## 🗺️ Roadmap

<table>
<tr>
<td width="33%" valign="top">

### 🔴 **High Priority**

- [ ] Authentication (JWT)
- [ ] Redis caching
- [ ] Streaming responses
- [ ] Unit & E2E tests
- [ ] Rate limiting

</td>
<td width="33%" valign="top">

### 🟡 **Medium Priority**

- [ ] WhatsApp integration
- [ ] Analytics dashboard
- [ ] Sentiment analysis
- [ ] Multi-language support
- [ ] File uploads

</td>
<td width="33%" valign="top">

### 🟢 **Low Priority**

- [ ] Voice input
- [ ] CRM integrations
- [ ] Custom themes
- [ ] Export conversations
- [ ] Admin panel

</td>
</tr>
</table>

---

## 🤝 Contributing

Contributions are welcome! 🎉

```bash
1. Fork the repository
2. Create feature branch (git checkout -b feature/amazing)
3. Commit changes (git commit -m 'Add amazing feature')
4. Push to branch (git push origin feature/amazing)
5. Open a Pull Request
```

<div align="center">

[![Contributors](https://img.shields.io/github/contributors/curiousrajneesh27/AI-AGENT-LIVECHAT?style=for-the-badge)](https://github.com/curiousrajneesh27/AI-AGENT-LIVECHAT/graphs/contributors)

</div>

---

## 📄 License

<div align="center">

**MIT License** - Free to use, modify, and distribute

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

## 🙏 Acknowledgments

<div align="center">

Special thanks to:

[![OpenAI](https://img.shields.io/badge/OpenAI-GPT_Models-412991?style=flat&logo=openai&logoColor=white)](https://openai.com/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-API_Aggregation-FF6B6B?style=flat)](https://openrouter.ai/)
[![Render](https://img.shields.io/badge/Render-Free_Hosting-46E3B7?style=flat&logo=render&logoColor=white)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Free_Hosting-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

<div align="center">

## 💼 About the Developer

**Rajneesh Verma** | Full-Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-curiousrajneesh27-181717?style=flat&logo=github)](https://github.com/curiousrajneesh27)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-00C7B7?style=flat&logo=google-chrome&logoColor=white)](#)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat&logo=linkedin&logoColor=white)](#)

---

### ⭐ If you like this project, give it a star!

### 💬 Have questions? [Open an issue](https://github.com/curiousrajneesh27/AI-AGENT-LIVECHAT/issues/new)

### 🚀 Want to contribute? [See contributing guidelines](#-contributing)

---

**Built with ❤️ using React, TypeScript, Node.js, and GPT**

_Making AI accessible, one conversation at a time._

</div>
