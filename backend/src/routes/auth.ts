import express, { Request, Response } from 'express';
import { z } from 'zod';

const router = express.Router();

// Dummy credentials for authentication
const DUMMY_USERS = [
  { id: '1', username: 'admin', password: 'admin123', name: 'Admin User' },
  { id: '2', username: 'user', password: 'user123', name: 'Regular User' },
  { id: '3', username: 'demo', password: 'demo123', name: 'Demo User' },
];

// Validation schemas
const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    // Find user in dummy database
    const user = DUMMY_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password',
      });
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      user: userWithoutPassword,
      token: `dummy-token-${user.id}`, // Simple dummy token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Signup route
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, password, name } = signupSchema.parse(req.body);

    // Check if user already exists
    const existingUser = DUMMY_USERS.find((u) => u.username === username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Username already exists',
      });
    }

    // Create new user (in a real app, this would be saved to database)
    const newUser = {
      id: String(DUMMY_USERS.length + 1),
      username,
      password,
      name,
    };

    DUMMY_USERS.push(newUser);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      user: userWithoutPassword,
      token: `dummy-token-${newUser.id}`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Verify token route (for session validation)
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token || !token.startsWith('dummy-token-')) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    const userId = token.replace('dummy-token-', '');
    const user = DUMMY_USERS.find((u) => u.id === userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;
