import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { storage } from '../lib/storage';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user profile
router.get('/profile', auth, async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const user = await storage.getUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({ error: errorMessage });
  }
});

// Update user profile
router.put(
  '/profile',
  auth,
  [
    body('name').optional(),
    body('phone').optional(),
  ],
  async (req: AuthRequest, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await storage.updateUser(req.user!.id, req.body);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json(user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      return res.status(500).json({ error: errorMessage });
    }
  }
);

export const usersRouter = router;
