import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { storage } from '../lib/storage';

const router = Router();
const JWT_SECRET = 'your-secret-key'; // In production, use environment variables

// Sign Up
router.post(
  '/signup',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty(),
  ],
  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, name } = req.body;
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        name,
      });

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
      return res.status(201).json({ user, token });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      return res.status(500).json({ error: errorMessage });
    }
  }
);

// Sign In
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').exists(),
  ],
  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
      return res.json({ user, token });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      return res.status(500).json({ error: errorMessage });
    }
  }
);

export const authRouter = router;
