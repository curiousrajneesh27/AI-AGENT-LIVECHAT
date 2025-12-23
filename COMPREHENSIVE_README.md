# 🤖 AI Live Chat Agent - Complete Technical Documentation

A production-ready, full-stack AI-powered customer support chat application with real-time conversation management, persistent storage, and intelligent response generation.

## 🌐 Live Application

- **Frontend**: https://ai-agent-livechat.vercel.app
- **Backend API**: https://ai-agent-livechat.onrender.com
- **Health Check**: https://ai-agent-livechat.onrender.com/api/chat/health
- **GitHub Repository**: https://github.com/curiousrajneesh27/AI-AGENT-LIVECHAT

---

## 📋 Table of Contents

1. [System Architecture](#-system-architecture)
2. [Database Schema](#-database-schema)
3. [API Endpoints Documentation](#-api-endpoints-documentation)
4. [Technology Stack](#-technology-stack)
5. [Setup & Installation](#-setup--installation)
6. [Features](#-features)
7. [Project Structure](#-project-structure)
8. [Deployment Guide](#-deployment-guide)

---

## 🏗️ System Architecture

### High-Level System Design

The application follows a **three-tier architecture** with clear separation of concerns:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER (Frontend)                          │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  React Application (TypeScript + Vite)                             │ │
│  │                                                                    │ │
│  │  ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐ │ │
│  │  │   Chat UI    │────>│  Session     │────>│  API Client      │ │ │
│  │  │   Widget     │     │  Management  │     │  (HTTP Requests) │ │ │
│  │  └──────────────┘     └──────────────┘     └──────────────────┘ │ │
│  │         │                     │                      │           │ │
│  │         └────── Display ──────┴────── Manage ────────┘           │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │ HTTPS Requests
                                 │ (POST /message, GET /history)
                                 ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER (Backend Server)                    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Express.js Server (Node.js + TypeScript)                          │ │
│  │                                                                    │ │
│  │  ┌──────────────────┐                                             │ │
│  │  │  1. VALIDATION   │  ← Input validation with Zod                │ │
│  │  │     LAYER        │    • Empty message check                    │ │
│  │  │                  │    • Length validation (2000 chars max)     │ │
│  │  │                  │    • Schema validation                      │ │
│  │  └────────┬─────────┘                                             │ │
│  │           ↓                                                        │ │
│  │  ┌──────────────────┐                                             │ │
│  │  │  2. ROUTE        │  ← API endpoint handlers                    │ │
│  │  │     HANDLERS     │    • POST /api/chat/message                 │ │
│  │  │                  │    • GET /api/chat/history/:id              │ │
│  │  │                  │    • GET /api/chat/health                   │ │
│  │  └────────┬─────────┘    • DELETE /api/chat/conversation/:id     │ │
│  │           ↓                                                        │ │
│  │  ┌──────────────────┐                                             │ │
│  │  │  3. BUSINESS     │  ← Core application logic                   │ │
│  │  │     LOGIC        │    ┌─────────────────────────────────────┐ │ │
│  │  │     LAYER        │    │  a) Find/Create Conversation        │ │ │
│  │  │                  │    │  b) Save User Message               │ │ │
│  │  │                  │    │  c) Fetch Conversation History      │ │ │
│  │  │                  │    │  d) Call LLM Provider               │ │ │
│  │  │                  │    │  e) Save AI Response                │ │ │
│  │  │                  │    └─────────────────────────────────────┘ │ │
│  │  └────────┬─────────┘                                             │ │
│  │           ↓                                                        │ │
│  │  ┌──────────────────┐                                             │ │
│  │  │  4. DATA ACCESS  │  ← Database operations                      │ │
│  │  │     LAYER        │    • Conversation Service                   │ │
│  │  │                  │    • Message Service                        │ │
│  │  │                  │    • CRUD operations                        │ │
│  │  └────────┬─────────┘                                             │ │
│  │           │                                                        │ │
│  └───────────┼────────────────────────────────────────────────────────┘ │
│              │                                                          │
│              ├──────────────────┐                                      │
│              ↓                  ↓                                      │
│  ┌──────────────────┐  ┌──────────────────┐                          │
│  │  5. LLM          │  │  6. ERROR        │                          │
│  │     INTEGRATION  │  │     HANDLING     │                          │
│  │                  │  │                  │                          │
│  │  OpenRouter API  │  │  • Try-catch     │                          │
│  │  • GPT-3.5-turbo │  │  • 400/404/500   │                          │
│  │  • Timeout: 30s  │  │  • User-friendly │                          │
│  │  • Retry logic   │  │    messages      │                          │
│  └──────────────────┘  └──────────────────┘                          │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │
                             ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                       DATA LAYER (Database)                              │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  SQLite Database (database.sqlite)                                 │ │
│  │                                                                    │ │
│  │  ┌──────────────────────┐        ┌──────────────────────┐       │ │
│  │  │  CONVERSATIONS       │        │     MESSAGES         │       │ │
│  │  │  TABLE               │        │     TABLE            │       │ │
│  │  │                      │        │                      │       │ │
│  │  │  • id (PK)           │◄───────│  • id (PK)           │       │ │
│  │  │  • created_at        │  1:N   │  • conversation_id   │       │ │
│  │  │  • updated_at        │        │    (FK)              │       │ │
│  │  │                      │        │  • sender            │       │ │
│  │  │  Indexes:            │        │  • text              │       │ │
│  │  │  • Primary key       │        │  • created_at        │       │ │
│  │  └──────────────────────┘        │                      │       │ │
│  │                                  │  Indexes:            │       │ │
│  │                                  │  • Primary key       │       │ │
│  │                                  │  • conversation_id   │       │ │
│  │                                  │  • created_at        │       │ │
│  │                                  └──────────────────────┘       │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘

                            ┌─────────────────────┐
                            │  EXTERNAL SERVICES  │
                            ├─────────────────────┤
                            │  OpenRouter API     │
                            │  (LLM Provider)     │
                            │                     │
                            │  • GPT-3.5-turbo    │
                            │  • GPT-4            │
                            │  • Claude, etc.     │
                            └─────────────────────┘
```

### Data Flow

#### **1. User Sends Message**

```
User Input → Frontend Validation → API Request
```

**Frontend Process**:
1. User types message in chat input
2. Click send button
3. Validate locally (not empty)
4. Create POST request to `/api/chat/message`
5. Show "AI is typing..." indicator
6. Disable input during processing

**Request Payload**:
```json
{
  "message": "What's your return policy?",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

#### **2. Backend Receives Request**

```
API Gateway → Validation → Route Handler
```

**Validation Layer** (`middleware/validation.ts`):
- Check if request body exists
- Validate against Zod schema
- Verify message length (1-2000 chars)
- Return 400 error if invalid

**Route Handler** (`routes/chat.ts`):
- Extract `message` and `sessionId`
- Pass to business logic

---

#### **3. Business Logic Processing**

```
Find Conversation → Save User Message → Fetch History → Call LLM → Save AI Reply
```

**Step 3a: Find or Create Conversation**

```typescript
if (!sessionId || !(await conversationService.exists(sessionId))) {
  const newConversation = await conversationService.create();
  conversationId = newConversation.id;
}
```

**Step 3b: Save User Message**

```typescript
const userMessage = await messageService.create(
  conversationId,
  'user',
  message
);
```

**Step 3c: Fetch Conversation History**

```typescript
const history = await messageService.getRecentHistory(conversationId, 10);
```

Returns last 10 messages for context.

**Step 3d: Call LLM Provider**

```typescript
const llmResponse = await generateAIReply(
  history.slice(0, -1),  // Exclude current message
  message
);
```

**LLM Provider Request**:
```json
{
  "model": "openai/gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful customer support agent for TechGadget Store..."
    },
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help you today?"
    },
    {
      "role": "user",
      "content": "What's your return policy?"
    }
  ],
  "max_tokens": 500,
  "temperature": 0.7
}
```

**Step 3e: Save AI Response**

```typescript
const aiMessage = await messageService.create(
  conversationId,
  'ai',
  llmResponse.reply
);
```

---

#### **4. Response Sent to Frontend**

```
Backend Response → Frontend Update → Display to User
```

**Response Payload**:
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

**Frontend Processing**:
1. Receive response
2. Hide "AI is typing..." indicator
3. Add AI message to message list
4. Auto-scroll to bottom
5. Store `sessionId` in sessionStorage
6. Re-enable input field

---

## 📊 Database Schema

### Entity-Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      CONVERSATIONS                          │
├─────────────────────────────────────────────────────────────┤
│  id              TEXT          PRIMARY KEY                  │
│  created_at      DATETIME      DEFAULT CURRENT_TIMESTAMP    │
│  updated_at      DATETIME      DEFAULT CURRENT_TIMESTAMP    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ 1:N Relationship
                         │
                         │
┌────────────────────────▼────────────────────────────────────┐
│                        MESSAGES                             │
├─────────────────────────────────────────────────────────────┤
│  id              TEXT          PRIMARY KEY                  │
│  conversation_id TEXT          FOREIGN KEY                  │
│  sender          TEXT          CHECK IN ('user', 'ai')     │
│  text            TEXT          NOT NULL                     │
│  created_at      DATETIME      DEFAULT CURRENT_TIMESTAMP    │
└─────────────────────────────────────────────────────────────┘

Indexes:
  - idx_messages_conversation_id ON messages(conversation_id)
  - idx_messages_created_at ON messages(created_at)

Foreign Key Constraints:
  - conversation_id REFERENCES conversations(id) ON DELETE CASCADE
```

### Table Specifications

#### **CONVERSATIONS Table**

Stores conversation metadata and grouping.

| Column      | Type     | Constraints               | Description                              |
|-------------|----------|---------------------------|------------------------------------------|
| id          | TEXT     | PRIMARY KEY               | UUID v4 (e.g., "550e8400-e29b...")       |
| created_at  | DATETIME | DEFAULT CURRENT_TIMESTAMP | ISO 8601 timestamp of creation           |
| updated_at  | DATETIME | DEFAULT CURRENT_TIMESTAMP | ISO 8601 timestamp of last update        |

**SQL Definition**:
```sql
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Example Row**:
```
id: 550e8400-e29b-41d4-a716-446655440000
created_at: 2025-12-23 10:30:00.000
updated_at: 2025-12-23 10:35:45.123
```

**Use Cases**:
- Group messages by conversation
- Track when conversations start/end
- Enable conversation-level operations (delete, archive)
- Calculate conversation duration

---

#### **MESSAGES Table**

Stores individual messages from users and AI.

| Column          | Type     | Constraints                          | Description                            |
|-----------------|----------|--------------------------------------|----------------------------------------|
| id              | TEXT     | PRIMARY KEY                          | UUID v4 for message                    |
| conversation_id | TEXT     | FOREIGN KEY → conversations(id)     | Parent conversation                    |
| sender          | TEXT     | CHECK (sender IN ('user', 'ai'))    | Message sender type                    |
| text            | TEXT     | NOT NULL                             | Message content (max 2000 chars)       |
| created_at      | DATETIME | DEFAULT CURRENT_TIMESTAMP            | ISO 8601 timestamp                     |

**SQL Definition**:
```sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
  text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) 
    ON DELETE CASCADE
);

-- Performance indexes
CREATE INDEX idx_messages_conversation_id 
  ON messages(conversation_id);

CREATE INDEX idx_messages_created_at 
  ON messages(created_at);
```

**Example Rows**:
```
┌──────────────────────────────────┬──────────────────────────────────┬────────┬─────────────────────────┬─────────────────────────┐
│ id                               │ conversation_id                  │ sender │ text                    │ created_at              │
├──────────────────────────────────┼──────────────────────────────────┼────────┼─────────────────────────┼─────────────────────────┤
│ 7c9e6679-7425-40de-944b...       │ 550e8400-e29b-41d4-a716...       │ user   │ What's your return...   │ 2025-12-23 10:30:00.000 │
│ 8d9e7780-8536-51ef-b828...       │ 550e8400-e29b-41d4-a716...       │ ai     │ We offer a 30-day...    │ 2025-12-23 10:30:02.500 │
└──────────────────────────────────┴──────────────────────────────────┴────────┴─────────────────────────┴─────────────────────────┘
```

---

### Database Relationships

#### **One-to-Many (1:N)**

```
1 Conversation → Many Messages
```

**Relationship Rules**:
- Each conversation can have 0 to unlimited messages
- Each message belongs to exactly 1 conversation
- Deleting a conversation deletes all its messages (CASCADE)

**SQL Enforcement**:
```sql
FOREIGN KEY (conversation_id) REFERENCES conversations(id) 
  ON DELETE CASCADE
```

---

### Indexes for Performance

#### **1. idx_messages_conversation_id**

**Purpose**: Fast retrieval of messages by conversation.

**Query Example**:
```sql
SELECT * FROM messages 
WHERE conversation_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY created_at ASC;
```

**Without Index**: O(n) - scans entire table  
**With Index**: O(log n) - uses B-tree lookup

**Impact**: 100x faster for conversations with 100+ messages.

---

#### **2. idx_messages_created_at**

**Purpose**: Efficient timestamp-based ordering and filtering.

**Query Example**:
```sql
SELECT * FROM messages 
WHERE conversation_id = '...'
ORDER BY created_at DESC
LIMIT 10;
```

**Impact**: Enables fast "recent messages" queries without full table scan.

---

### CRUD Operations

#### **Create Conversation**

```sql
INSERT INTO conversations (id, created_at, updated_at)
VALUES ('550e8400-e29b-41d4-a716-446655440000', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
```

**TypeScript**:
```typescript
const newConversation = await conversationService.create();
// Returns: { id: '550e8400-...', created_at: '2025-12-23T10:30:00.000Z', ... }
```

---

#### **Create Message**

```sql
INSERT INTO messages (id, conversation_id, sender, text, created_at)
VALUES (
  '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  '550e8400-e29b-41d4-a716-446655440000',
  'user',
  'What is your return policy?',
  CURRENT_TIMESTAMP
);
```

**TypeScript**:
```typescript
const message = await messageService.create(
  conversationId,
  'user',
  'What is your return policy?'
);
```

---

#### **Read Conversation History**

```sql
SELECT id, sender, text, created_at
FROM messages
WHERE conversation_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY created_at ASC;
```

**TypeScript**:
```typescript
const messages = await messageService.getByConversationId(conversationId);
```

---

#### **Read Recent History (for LLM Context)**

```sql
SELECT id, sender, text, created_at
FROM messages
WHERE conversation_id = '...'
ORDER BY created_at DESC
LIMIT 10;
```

**TypeScript**:
```typescript
const recentMessages = await messageService.getRecentHistory(conversationId, 10);
```

---

#### **Delete Conversation (with Cascade)**

```sql
DELETE FROM conversations
WHERE id = '550e8400-e29b-41d4-a716-446655440000';
```

**Effect**: Automatically deletes all messages in that conversation due to `ON DELETE CASCADE`.

**TypeScript**:
```typescript
await conversationService.delete(conversationId);
```

---

## 🔌 API Endpoints Documentation

### Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://ai-agent-livechat.onrender.com/api`

---

### Endpoint Summary

| Method | Endpoint                          | Description                      |
|--------|-----------------------------------|----------------------------------|
| POST   | `/api/chat/message`               | Send message, get AI reply       |
| GET    | `/api/chat/history/:id`           | Get conversation history         |
| GET    | `/api/chat/health`                | Health check & system status     |
| DELETE | `/api/chat/conversation/:id`      | Delete conversation              |

---

### 1. POST `/api/chat/message`

**Description**: Send a user message and receive an AI-generated response.

#### Request

**Headers**:
```http
Content-Type: application/json
```

**Body** (JSON):
```json
{
  "message": "What's your return policy?",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Parameters**:

| Field     | Type   | Required | Constraints             | Description                          |
|-----------|--------|----------|-------------------------|--------------------------------------|
| message   | string | Yes      | 1-2000 characters       | User's message text                  |
| sessionId | string | No       | Valid UUID v4           | Conversation ID (auto-created if not provided) |

#### Response

**Success (200 OK)**:
```json
{
  "success": true,
  "reply": "We offer a 30-day return policy for all products. Items must be unused and in original packaging. Returns for defective items are free, while other returns have a $5 shipping fee.",
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

**Response Fields**:

| Field        | Type   | Description                                    |
|--------------|--------|------------------------------------------------|
| success      | boolean| Operation success status                       |
| reply        | string | AI-generated response                          |
| sessionId    | string | Conversation ID (use for subsequent messages)  |
| messageId    | string | Unique ID of AI message                        |
| timestamp    | string | ISO 8601 timestamp                             |
| metadata     | object | Performance and LLM metadata                   |

**Error (400 Bad Request)** - Empty Message:
```json
{
  "success": false,
  "error": "Message cannot be empty",
  "details": {
    "field": "message",
    "validation": "min length 1"
  }
}
```

**Error (400 Bad Request)** - Message Too Long:
```json
{
  "success": false,
  "error": "Message exceeds maximum length of 2000 characters"
}
```

**Error (500 Internal Server Error)** - LLM Failure:
```json
{
  "success": false,
  "error": "Failed to generate AI response",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "retryable": true
}
```

#### cURL Example

```bash
curl -X POST https://ai-agent-livechat.onrender.com/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are your support hours?",
    "sessionId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

---

### 2. GET `/api/chat/history/:conversationId`

**Description**: Retrieve all messages from a specific conversation.

#### Request

**Path Parameters**:

| Parameter      | Type   | Required | Description                   |
|----------------|--------|----------|-------------------------------|
| conversationId | string | Yes      | UUID of conversation          |

**Example**:
```http
GET /api/chat/history/550e8400-e29b-41d4-a716-446655440000
```

#### Response

**Success (200 OK)**:
```json
{
  "success": true,
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "messageCount": 4,
  "messages": [
    {
      "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "sender": "user",
      "text": "Hello, I need help",
      "timestamp": "2025-12-23T10:30:00.000Z"
    },
    {
      "id": "8d9e7780-8536-51ef-b828-f18gd2g01bf8",
      "sender": "ai",
      "text": "Hi! I'm your virtual support agent. How can I help you today?",
      "timestamp": "2025-12-23T10:30:02.500Z"
    },
    {
      "id": "9e0f8891-9647-62fg-c939-g29he3h12cg9",
      "sender": "user",
      "text": "What's your return policy?",
      "timestamp": "2025-12-23T10:30:45.000Z"
    },
    {
      "id": "0f1g99a2-a758-73gh-d040-h30if4i23dh0",
      "sender": "ai",
      "text": "We offer a 30-day return policy for all products...",
      "timestamp": "2025-12-23T10:30:47.123Z"
    }
  ]
}
```

**Error (400 Bad Request)** - Invalid UUID:
```json
{
  "success": false,
  "error": "Invalid conversation ID format"
}
```

**Error (404 Not Found)**:
```json
{
  "success": false,
  "error": "Conversation not found"
}
```

#### cURL Example

```bash
curl https://ai-agent-livechat.onrender.com/api/chat/history/550e8400-e29b-41d4-a716-446655440000
```

---

### 3. GET `/api/chat/health`

**Description**: System health check with LLM and database status.

#### Request

```http
GET /api/chat/health
```

#### Response

**Success (200 OK)**:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-12-23T10:30:00.000Z",
  "system": {
    "llm": {
      "provider": "openrouter",
      "model": "openai/gpt-3.5-turbo",
      "maxTokens": 500,
      "temperature": 0.7,
      "timeout": 30000
    },
    "database": "connected",
    "uptime": 86400,
    "memory": {
      "used": 45,
      "total": 512
    }
  }
}
```

**Response Fields**:

| Field              | Type   | Description                           |
|--------------------|--------|---------------------------------------|
| status             | string | "healthy" or "degraded"               |
| timestamp          | string | Current server time (ISO 8601)        |
| system.llm         | object | LLM configuration                     |
| system.database    | string | Database connection status            |
| system.uptime      | number | Server uptime in seconds              |
| system.memory      | object | Memory usage (MB)                     |

#### cURL Example

```bash
curl https://ai-agent-livechat.onrender.com/api/chat/health
```

**Use Cases**:
- Monitoring/alerting systems (e.g., Datadog, New Relic)
- Load balancer health checks
- Debugging configuration issues

---

### 4. DELETE `/api/chat/conversation/:conversationId`

**Description**: Delete a conversation and all its messages permanently.

#### Request

**Path Parameters**:

| Parameter      | Type   | Required | Description                    |
|----------------|--------|----------|--------------------------------|
| conversationId | string | Yes      | UUID of conversation to delete |

**Example**:
```http
DELETE /api/chat/conversation/550e8400-e29b-41d4-a716-446655440000
```

#### Response

**Success (200 OK)**:
```json
{
  "success": true,
  "message": "Conversation deleted successfully"
}
```

**Error (404 Not Found)**:
```json
{
  "success": false,
  "error": "Conversation not found"
}
```

**Error (500 Internal Server Error)**:
```json
{
  "success": false,
  "error": "Failed to delete conversation"
}
```

#### cURL Example

```bash
curl -X DELETE https://ai-agent-livechat.onrender.com/api/chat/conversation/550e8400-e29b-41d4-a716-446655440000
```

**Note**: This operation is irreversible. All messages in the conversation are permanently deleted due to `ON DELETE CASCADE`.

---

## 🛠️ Technology Stack

### Backend

| Technology       | Version | Purpose                                          |
|------------------|---------|--------------------------------------------------|
| **Node.js**      | 18+     | JavaScript runtime for server                    |
| **TypeScript**   | 5.3+    | Type-safe JavaScript superset                    |
| **Express.js**   | 4.18+   | Web framework for RESTful API                    |
| **SQLite3**      | 5.1+    | Embedded SQL database                            |
| **OpenRouter**   | Latest  | LLM API aggregation platform                     |
| **Zod**          | 3.22+   | Runtime type checking & validation               |
| **UUID**         | 9.0+    | RFC4122 UUID generation                          |
| **CORS**         | 2.8+    | Cross-origin resource sharing middleware         |
| **Dotenv**       | 16.3+   | Environment variable loader                      |
| **Nodemon**      | 3.0+    | Development auto-restart on file changes         |

### Frontend

| Technology       | Version | Purpose                                          |
|------------------|---------|--------------------------------------------------|
| **React**        | 18.2+   | Component-based UI framework                     |
| **TypeScript**   | 5.3+    | Type-safe JavaScript                             |
| **Vite**         | 5.0+    | Fast build tool & dev server                     |
| **CSS3**         | -       | Modern styling (Flexbox, Grid, animations)       |

### DevOps & Hosting

| Platform         | Tier    | Purpose                                          |
|------------------|---------|--------------------------------------------------|
| **Render.com**   | Free    | Backend hosting (auto-deploy from GitHub)        |
| **Vercel**       | Free    | Frontend hosting (auto-deploy from GitHub)       |
| **GitHub**       | Free    | Version control & CI/CD trigger                  |

### Development Tools

| Tool             | Purpose                                          |
|------------------|--------------------------------------------------|
| **npm**          | Package manager                                  |
| **Git**          | Version control                                  |
| **VS Code**      | Code editor (recommended)                        |
| **Postman**      | API testing (optional)                           |

---

## 🚀 Setup & Installation

### Prerequisites

✅ **Node.js** 18+ and npm  
✅ **Git** for version control  
✅ **OpenRouter API Key** - [Get one here](https://openrouter.ai/keys)  
✅ **Code Editor** (VS Code recommended)

---

### Installation Steps

#### **Step 1: Clone Repository**

```bash
git clone https://github.com/curiousrajneesh27/AI-AGENT-LIVECHAT.git
cd AI-AGENT-LIVECHAT
```

#### **Step 2: Install Dependencies**

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

#### **Step 3: Configure Environment Variables**

**Backend Configuration**:

```bash
# Create .env file from template
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here

# Optional: Site information for OpenRouter analytics
YOUR_SITE_URL=http://localhost:5173
YOUR_SITE_NAME=AI Live Chat Development

# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_PATH=./database.sqlite

# LLM Configuration
MAX_TOKENS=500
TEMPERATURE=0.7
MODEL=openai/gpt-3.5-turbo

# Rate Limiting
MAX_MESSAGE_LENGTH=2000
```

**Environment Variable Explanations**:

| Variable             | Description                                              | Default                  |
|----------------------|----------------------------------------------------------|--------------------------|
| OPENROUTER_API_KEY   | Your OpenRouter API key (required)                       | -                        |
| YOUR_SITE_URL        | Your website URL (for OpenRouter analytics)              | -                        |
| YOUR_SITE_NAME       | Your website name (for OpenRouter analytics)             | -                        |
| PORT                 | Backend server port                                      | 5000                     |
| NODE_ENV             | Environment (development/production)                     | development              |
| DATABASE_PATH        | SQLite database file location                            | ./database.sqlite        |
| MAX_TOKENS           | Maximum tokens in AI response                            | 500                      |
| TEMPERATURE          | LLM creativity level (0-1)                               | 0.7                      |
| MODEL                | LLM model identifier                                     | openai/gpt-3.5-turbo     |
| MAX_MESSAGE_LENGTH   | Max characters per user message                          | 2000                     |

---

#### **Step 4: Run Application**

**Option A: Run Both Servers Together (Recommended)**

```bash
npm run dev
```

This starts:
- 🟢 Backend API on `http://localhost:5000`
- 🟢 Frontend on `http://localhost:3000`

**Option B: Run Servers Separately**

**Terminal 1** (Backend):
```bash
cd backend
npm run dev
```

**Terminal 2** (Frontend):
```bash
cd frontend
npm run dev
```

---

#### **Step 5: Test Application**

1. Open browser: `http://localhost:3000`
2. Type a message: "What's your return policy?"
3. AI should respond within 2-3 seconds ✨

---

### Verify Installation

**Check Backend Health**:
```bash
curl http://localhost:5000/api/chat/health
```

**Expected Response**:
```json
{
  "success": true,
  "status": "healthy",
  "system": {
    "llm": {
      "model": "openai/gpt-3.5-turbo"
    },
    "database": "connected"
  }
}
```

**Test Message API**:
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

---

## ✨ Features

### Core Functionality

✅ **Real-time AI Chat**
- Powered by OpenAI GPT-3.5-turbo via OpenRouter
- Context-aware responses using conversation history
- Pre-loaded domain knowledge (TechGadget Store FAQs)
- Average response time: <2 seconds

✅ **Conversation Persistence**
- SQLite database for reliable message storage
- Conversations survive page reloads/browser restarts
- Full conversation history retrieval
- Automatic conversation creation

✅ **Session Management**
- SessionID stored in browser `sessionStorage`
- Automatic session resumption on page load
- Seamless conversation continuity
- No login required

✅ **Beautiful User Interface**
- Clean, modern chat design
- Message bubbles (user: right, AI: left, different colors)
- Timestamps for each message
- Smooth animations and transitions
- Mobile-responsive layout

✅ **Error Handling**
- Empty message validation (frontend + backend)
- Message length limits (2000 characters)
- Network timeout protection (30 seconds)
- User-friendly error messages
- Retryable error detection
- Graceful degradation

✅ **Input Validation**
- Frontend: Real-time validation before sending
- Backend: Zod schema validation
- SQL injection prevention (parameterized queries)
- XSS protection (text sanitization)

✅ **Domain Knowledge**
- Pre-configured TechGadget Store FAQs:
  - Shipping policies (free shipping over $50)
  - Return policies (30-day returns)
  - Support hours (Mon-Fri 9 AM - 6 PM EST)
  - Payment methods (credit cards, PayPal, Apple Pay)
  - Warranty information

### Advanced Features

🎨 **Visual Feedback**
- Typing indicator ("AI is typing...")
- Message send animation
- Smooth auto-scroll to latest messages
- Disabled input during AI processing
- Loading states

📱 **Responsive Design**
- Works on desktop, tablet, and mobile
- Adaptive layout (flexbox + CSS grid)
- Touch-friendly interface
- Optimized for all screen sizes

⚡ **Performance Optimizations**
- Database indexes for fast queries
- Optimistic UI updates (user messages appear instantly)
- Efficient React re-renders (React.memo, useCallback)
- Lazy loading (future enhancement)

🔒 **Security**
- Environment variables for secrets
- HTTPS in production
- CORS configuration
- Input sanitization
- Rate limiting (future enhancement)

---

## 📁 Project Structure

```
AI-AGENT-LIVECHAT/
│
├── backend/                             # Backend Node.js application
│   ├── src/
│   │   ├── database/
│   │   │   ├── db.ts                   # Database initialization & connection
│   │   │   └── services.ts             # CRUD operations for conversations & messages
│   │   │
│   │   ├── llm/
│   │   │   ├── service.ts              # LLM API integration (OpenRouter/OpenAI)
│   │   │   └── knowledge.ts            # Domain knowledge & system prompts
│   │   │
│   │   ├── middleware/
│   │   │   ├── validation.ts           # Zod validation middleware
│   │   │   └── errorHandler.ts         # Global error handling middleware
│   │   │
│   │   ├── routes/
│   │   │   └── chat.ts                 # Chat API routes
│   │   │
│   │   ├── validators/
│   │   │   └── schemas.ts              # Zod validation schemas
│   │   │
│   │   └── index.ts                    # Express app entry point
│   │
│   ├── package.json                    # Backend dependencies
│   ├── tsconfig.json                   # TypeScript compiler configuration
│   ├── nodemon.json                    # Nodemon configuration for auto-restart
│   ├── .env                            # Environment variables (not in git)
│   └── .env.example                    # Environment variable template
│
├── frontend/                            # Frontend React application
│   ├── src/
│   │   ├── api/
│   │   │   └── chat.ts                 # API client with fetch wrappers
│   │   │
│   │   ├── components/
│   │   │   ├── Message.tsx             # Message bubble component
│   │   │   ├── Message.css             # Message styling
│   │   │   ├── TypingIndicator.tsx     # Typing animation component
│   │   │   └── TypingIndicator.css     # Typing animation styling
│   │   │
│   │   ├── App.tsx                     # Main chat application component
│   │   ├── App.css                     # Application styling
│   │   ├── main.tsx                    # React entry point
│   │   ├── index.css                   # Global styles
│   │   └── vite-env.d.ts               # Vite type declarations
│   │
│   ├── public/                         # Static assets
│   ├── index.html                      # HTML template
│   ├── package.json                    # Frontend dependencies
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── tsconfig.node.json              # Node-specific TypeScript config
│   ├── vite.config.ts                  # Vite build configuration
│   ├── .env.example                    # Environment variable template
│   └── .env.production                 # Production environment variables
│
├── package.json                         # Root package with dev scripts
├── .gitignore                          # Git ignore rules
├── vercel.json                         # Vercel deployment configuration
├── render.yaml                         # Render deployment configuration
├── README.md                           # Main documentation (you are here)
├── DEPLOY_NOW.md                       # Quick deployment guide
├── DEPLOYMENT.md                       # Detailed deployment instructions
├── ARCHITECTURE.md                     # System architecture documentation
└── TECHNICAL_ARCHITECTURE.md           # Technical implementation details
```

---

## 🌐 Deployment Guide

### Production Deployment

#### **Backend Deployment (Render.com)**

1. **Sign up**: Visit [render.com](https://render.com)

2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect GitHub account
   - Select repository: `AI-AGENT-LIVECHAT`

3. **Configure Service**:
   - **Name**: `ai-agent-livechat`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free ($0/month)

4. **Environment Variables**:
   ```
   OPENROUTER_API_KEY=sk-or-v1-your-key
   NODE_ENV=production
   PORT=10000
   MODEL=openai/gpt-3.5-turbo
   MAX_TOKENS=500
   TEMPERATURE=0.7
   DATABASE_PATH=./database.sqlite
   ```

5. **Deploy**: Click "Create Web Service"

6. **Get URL**: Copy backend URL (e.g., `https://ai-agent-livechat.onrender.com`)

---

#### **Frontend Deployment (Vercel)**

1. **Sign up**: Visit [vercel.com](https://vercel.com)

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Select `AI-AGENT-LIVECHAT` from GitHub

3. **Configure**:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variable**:
   ```
   VITE_API_URL=https://ai-agent-livechat.onrender.com/api
   ```
   *(Replace with your Render backend URL)*

5. **Deploy**: Click "Deploy"

6. **Test**: Visit Vercel URL (e.g., `https://ai-agent-livechat.vercel.app`)

---

### Auto-Deployment

Both platforms support automatic deployment on git push:

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

- Render redeploys backend automatically
- Vercel redeploys frontend automatically
- Zero-downtime deployments

---

## 🎓 License

MIT License - Free to use, modify, and distribute.

---

## 👤 Author

**Rajneesh Verma**  
GitHub: [@curiousrajneesh27](https://github.com/curiousrajneesh27)  
Project: [AI-AGENT-LIVECHAT](https://github.com/curiousrajneesh27/AI-AGENT-LIVECHAT)

---

## 🙏 Acknowledgments

- **OpenAI** for GPT models
- **OpenRouter** for unified LLM API access
- **Render** & **Vercel** for generous free hosting tiers
- **React** & **Vite** communities for excellent frameworks

---

**Built with ❤️ for production-ready AI chat experiences**
