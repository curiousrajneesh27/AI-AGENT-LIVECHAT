# Authentication System

This application now includes a simple authentication system with dummy credentials.

## Features

- **Beautiful Landing Page**: Shows "I'm your tech support and I support you" with an animated design
- **Login & Signup**: Tab-based authentication interface
- **Session Management**: Keeps users logged in using localStorage
- **Protected Routes**: Chat interface is only accessible after authentication
- **User Greeting**: Personalized welcome message with user's name
- **Logout**: Clean logout functionality that clears all session data

## Demo Credentials

Use any of these credentials to login:

- **Username:** `admin` | **Password:** `admin123`
- **Username:** `user` | **Password:** `user123`
- **Username:** `demo` | **Password:** `demo123`

## Signup

You can also create a new account with:

- Username (minimum 3 characters)
- Password (minimum 6 characters)
- Full Name (minimum 2 characters)

## How It Works

1. **Frontend**:

   - `AuthPage.tsx`: Beautiful authentication UI with login/signup forms
   - `AuthContext.tsx`: Manages authentication state globally
   - `App.tsx`: Routes between auth and chat based on authentication status
   - `ChatApp.tsx`: The main chat interface (protected)

2. **Backend**:
   - `routes/auth.ts`: Handles login, signup, and token verification
   - Dummy user database stored in memory
   - Simple token-based authentication

## Starting the Application

1. **Backend**:

   ```bash
   cd backend
   npm run dev
   ```

2. **Frontend**:

   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to the frontend URL (usually `http://localhost:5173`)

4. You'll see the authentication page. Use one of the demo credentials or sign up!

## Security Note

⚠️ This is a **demo authentication system** using dummy credentials. For production use, you should:

- Implement proper password hashing (bcrypt)
- Use JWT tokens with expiration
- Store users in a real database
- Add HTTPS
- Implement CSRF protection
- Add rate limiting
- Use secure session management
