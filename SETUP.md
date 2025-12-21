# SETUP INSTRUCTIONS

Follow these steps to get the AI Live Chat Agent running on your local machine.

## Step 1: Install Dependencies

Open PowerShell in the project root directory and run:

```powershell
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## Step 2: Set Up Environment Variables

### Backend Configuration

1. Copy the example environment file:
```powershell
Copy-Item .env.example backend\.env
```

2. Open `backend\.env` in a text editor and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

You can get an API key from: https://platform.openai.com/api-keys

### Frontend Configuration (Optional)

If you want to customize the API URL:
```powershell
Copy-Item frontend\.env.example frontend\.env
```

By default, it connects to `http://localhost:5000/api`

## Step 3: Run the Application

### Option A: Run Everything at Once (Recommended)

From the project root:
```powershell
npm run dev
```

This will start:
- ✅ Backend API on http://localhost:5000
- ✅ Frontend on http://localhost:3000

### Option B: Run Separately

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

## Step 4: Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the chat interface! Try asking:
- "What's your return policy?"
- "Do you offer free shipping?"
- "What are your support hours?"

## Troubleshooting

### "Module not found" errors
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules, backend/node_modules, frontend/node_modules
npm install
cd backend; npm install; cd ..
cd frontend; npm install; cd ..
```

### "Port already in use"
```powershell
# Kill process on port 5000
$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($process) { Stop-Process -Id $process.OwningProcess -Force }

# Kill process on port 3000
$process = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($process) { Stop-Process -Id $process.OwningProcess -Force }
```

### "Invalid API key"
- Verify your `backend\.env` file contains a valid OpenAI API key
- Check for extra spaces or quotes around the key
- Restart the backend server after updating `.env`

### Database issues
```powershell
# Delete and recreate database
Remove-Item backend/database.sqlite -ErrorAction SilentlyContinue
# Restart backend - it will auto-create the database
```

## Building for Production

```powershell
# Build both projects
npm run build

# Start production server
cd backend
npm start
```

The frontend build will be in `frontend/dist/` and can be served by any static file server or deployed to Vercel/Netlify.

## Need Help?

- Check the README.md for detailed documentation
- Ensure Node.js 18+ is installed: `node --version`
- Ensure npm is installed: `npm --version`
- Review the console output for error messages
