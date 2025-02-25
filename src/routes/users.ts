import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { storage } from '../lib/storage';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user profile
router.get('/profile', auth, async (req: AuthRequest, res) => {
  try {
    const user = await storage.getUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await storage.updateUser(req.user!.id, req.body);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export const usersRouter = router;