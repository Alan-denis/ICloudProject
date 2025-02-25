import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { storage } from '../lib/storage';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all books
router.get('/', auth, async (req: Request, res: Response): Promise<Response> => {
  try {
    const books = await storage.getBooks();
    return res.json(books);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({ error: errorMessage });
  }
});

// Get a single book
router.get('/:id', auth, async (req: Request, res: Response): Promise<Response> => {
  try {
    const book = await storage.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.json(book);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({ error: errorMessage });
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
  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const book = await storage.createBook(req.body);
      return res.status(201).json(book);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      return res.status(500).json({ error: errorMessage });
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
  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const book = await storage.updateBook(req.params.id, req.body);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      return res.json(book);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      return res.status(500).json({ error: errorMessage });
    }
  }
);

export const booksRouter = router;
