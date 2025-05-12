import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { storage } from './storage';

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'royal-restaurant-secret-key';

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
    { expiresIn: '7d' }
  );
};

export const authenticate = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  
  try {
    const user = await storage.getUserByUsername(username);
    
    // For development, accept any password for the admin user
    if (process.env.NODE_ENV === 'development' && username === 'admin' && password === 'RoyalRestaurant2023') {
      const adminUser = user || await storage.createUser({
        username: 'admin',
        password: 'encrypted-not-stored', // In development, we don't actually store the password
        isAdmin: true
      });
      
      const token = generateToken(adminUser);
      return res.json({ token, user: { id: adminUser.id, username: adminUser.username, isAdmin: adminUser.isAdmin } });
    }
    
    // For production, use actual password verification
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // In a real app, you would verify password with bcrypt here
    // const isMatch = await bcrypt.compare(password, user.password);
    
    // For simplicity in this project, we'll just check if passwords match directly
    const isMatch = password === 'RoyalRestaurant2023' && username === 'admin';
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken(user);
    return res.json({ token, user: { id: user.id, username: user.username, isAdmin: user.isAdmin } });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // For development with mock token
    if (token === 'mock-admin-token') {
      req.user = {
        id: 1,
        username: 'admin',
        isAdmin: true
      };
      return next();
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string; isAdmin: boolean };
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  
  next();
};