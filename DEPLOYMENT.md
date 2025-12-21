# AI Live Chat Agent - Deployment Guide

## Quick Deploy Options

### Backend Deployment

#### Option 1: Render.com (Recommended)

1. Create account at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ai-chat-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   ```
   OPENAI_API_KEY=your-key-here
   NODE_ENV=production
   ```

6. Click "Create Web Service"

Your API will be available at: `https://ai-chat-backend.onrender.com`

#### Option 2: Railway.app

1. Visit [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Click "Add variables" and set:
   ```
   OPENAI_API_KEY=your-key-here
   NODE_ENV=production
   ```
5. In Settings:
   - Root Directory: `/backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

#### Option 3: Fly.io

```bash
# Install flyctl
# Visit: https://fly.io/docs/hands-on/install-flyctl/

cd backend

# Create fly.toml
cat > fly.toml << EOF
app = "ai-chat-backend"
primary_region = "iad"

[build]
  builder = "heroku/buildpacks:20"

[env]
  PORT = "8080"
  NODE_ENV = "production"

[[services]]
  http_checks = []
  internal_port = 8080
  processes = ["app"]
  protocol = "tcp"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
EOF

# Deploy
fly launch
fly secrets set OPENAI_API_KEY=your-key-here
fly deploy
```

### Frontend Deployment

#### Option 1: Vercel (Recommended)

1. Visit [vercel.com](https://vercel.com)
2. "Import Project" → Connect GitHub
3. Select your repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

6. Click "Deploy"

#### Option 2: Netlify

1. Visit [netlify.com](https://netlify.com)
2. "Add new site" → "Import an existing project"
3. Connect GitHub and select repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

5. Environment variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

6. Click "Deploy site"

#### Option 3: Cloudflare Pages

```bash
cd frontend

# Build locally
npm run build

# Deploy with Wrangler
npx wrangler pages publish dist
```

## Database Considerations

### SQLite in Production

✅ **Good for:**
- MVP/Demo deployments
- Low-traffic applications
- Single-server deployments

⚠️ **Limitations:**
- Single server only (no horizontal scaling)
- File-based (ensure persistent storage)

### Upgrading to PostgreSQL

For production, consider PostgreSQL:

1. **Update `backend/package.json`:**
```json
"dependencies": {
  "pg": "^8.11.3"
}
```

2. **Replace in `backend/src/database/db.ts`:**
```typescript
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
```

3. **Update queries to use parameterized syntax**

4. **Provision PostgreSQL:**
   - Render: Free PostgreSQL in dashboard
   - Railway: PostgreSQL plugin
   - Supabase: Free tier available

## Environment Variables Summary

### Backend (.env)
```env
# Required
OPENAI_API_KEY=sk-...

# Optional (have defaults)
PORT=5000
NODE_ENV=production
DATABASE_PATH=./database.sqlite
MODEL=gpt-3.5-turbo
MAX_TOKENS=500
TEMPERATURE=0.7
MAX_MESSAGE_LENGTH=2000
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.com/api
```

## Post-Deployment Checklist

- [ ] Backend health check works: `GET https://your-backend/api/chat/health`
- [ ] Frontend loads without errors
- [ ] Can send messages and receive AI responses
- [ ] Conversation history persists across page reloads
- [ ] Error messages display properly
- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS configured correctly (backend allows frontend domain)
- [ ] Environment variables are set correctly
- [ ] Database is persisted (not wiped on restart)

## Monitoring

### Free Monitoring Tools

- **Backend logs**: Check your hosting provider's dashboard
- **Uptime monitoring**: [UptimeRobot](https://uptimerobot.com) (free)
- **Error tracking**: [Sentry](https://sentry.io) (free tier)
- **Analytics**: [PostHog](https://posthog.com) (free tier)

## Cost Estimates

### Free Tier Deployment

| Service | Cost |
|---------|------|
| Render (Backend) | $0/month (with sleep) |
| Vercel (Frontend) | $0/month |
| OpenAI API | ~$0.002 per message (GPT-3.5) |

**Estimated total for 1000 messages/month**: ~$2

### Paid Tier (for production)

| Service | Cost |
|---------|------|
| Render Standard | $7/month |
| Vercel Pro | $20/month |
| PostgreSQL (Render) | $7/month |
| OpenAI API | Variable |

## Troubleshooting Deployment

### Backend won't start
- Check logs for errors
- Verify `OPENAI_API_KEY` is set
- Ensure `npm run build` completes successfully
- Check Node.js version (should be 18+)

### Frontend can't reach backend
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Test backend URL directly in browser
- Ensure both use HTTPS (or both HTTP for local)

### Database data is lost on restart
- Check if hosting provides persistent storage
- Ensure `DATABASE_PATH` points to persistent volume
- Consider upgrading to PostgreSQL

## Scaling Considerations

When you need to scale:

1. **Move to PostgreSQL** (database)
2. **Add Redis** (caching, session storage)
3. **Implement rate limiting** (protect against abuse)
4. **Add load balancing** (multiple backend instances)
5. **Use CDN** (for frontend assets)
6. **Stream LLM responses** (better UX for long responses)

---

Need help? Check the [README.md](README.md) for more details or create an issue on GitHub.
