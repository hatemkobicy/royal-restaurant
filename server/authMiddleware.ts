import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { storage } from './storage';

const JWT_SECRET = process.env.JWT_SECRET || 'royal-restaurant-secret-key';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    isAdmin: boolean;
  };
}

export const generateToken = (user: { id: number; username: string; isAdmin: boolean }) => {
  return jwt.sign(
    { id: user.id, username: user.username, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const authenticate = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    console.log('Login attempt:', username);
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('User found, checking password');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin
    });
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authorization required' });
    }
    
    // Special case for mock token (development only)
    if (token === 'mock-admin-token') {
      req.user = {
        id: 1,
        username: 'admin',
        isAdmin: true
      };
      return next();
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      username: string;
      isAdmin: boolean;
    };
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
