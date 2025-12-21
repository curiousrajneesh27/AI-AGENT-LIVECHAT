# 🚀 QUICK START GUIDE

## ⚠️ IMPORTANT: Add Your OpenAI API Key

Before running the application, you **MUST** add your OpenAI API key:

1. Open the file: `backend\.env`
2. Find the line that says: `OPENAI_API_KEY=`
3. Add your API key after the equals sign: `OPENAI_API_KEY=sk-your-actual-key-here`

### Where to get an OpenAI API Key:
1. Go to: https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key and paste it in `backend\.env`

**Note**: The key starts with `sk-` and looks like: `sk-proj-abc123...`

## Running the Application

Once you've added your API key, run:

```powershell
npm run dev
```

This will start:
- Backend API on http://localhost:5000
- Frontend on http://localhost:3000

Then open your browser to: **http://localhost:3000**

## Test Questions

Try asking the AI agent:
- "What's your return policy?"
- "Do you offer free shipping?"
- "What are your support hours?"
- "How long does shipping take?"
- "Can I return a sale item?"

## Troubleshooting

**"Invalid API key" error?**
- Make sure you saved `backend\.env` after adding your key
- Check there are no extra spaces or quotes around the key
- Restart the backend server (Ctrl+C and run `npm run dev` again)

**Ports already in use?**
```powershell
# Kill processes on ports 5000 and 3000
$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($process) { Stop-Process -Id $process.OwningProcess -Force }
$process = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($process) { Stop-Process -Id $process.OwningProcess -Force }
```

## Project Structure

```
AI-LIVE-CHAT/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── database/ # SQLite database & services
│   │   ├── llm/      # OpenAI integration
│   │   ├── routes/   # API endpoints
│   │   └── index.ts  # Server entry point
│   └── .env          # ← ADD YOUR API KEY HERE
│
├── frontend/         # React app
│   └── src/
│       ├── components/  # Chat UI components
│       ├── api/         # API client
│       └── App.tsx      # Main app
│
└── README.md        # Full documentation
```

## Next Steps

1. ✅ Dependencies installed
2. ⏳ Add your OpenAI API key to `backend\.env`
3. ⏳ Run `npm run dev`
4. ⏳ Open http://localhost:3000
5. ⏳ Start chatting!

For more details, see [README.md](README.md) and [DEPLOYMENT.md](DEPLOYMENT.md)
