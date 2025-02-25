import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { storage } from '../lib/storage';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all books
router.get('/', auth, async (req, res) => {
  try {
    const books = await storage.getBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single book
router.get('/:id', auth, async (req, res) => {
  try {
    const book = await storage.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new book
router.post(
  '/',
  auth,
  [
    body('title').notEmpty(),
    body('author').notEmpty(),
    body('isbn').notEmpty(),
    body('quantity').isInt({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const book = await storage.createBook(req.body);
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update a book
router.put(
  '/:id',
  auth,
  [
    body('title').optional(),
    body('author').optional(),
    body('isbn').optional(),
    body('quantity').optional().isInt({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const book = await storage.updateBook(req.params.id, req.body);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export const booksRouter = router;