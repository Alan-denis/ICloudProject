"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const storage_1 = require("../lib/storage");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all books
router.get('/', auth_1.auth, async (req, res) => {
    try {
        const books = await storage_1.storage.getBooks();
        return res.json(books);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return res.status(500).json({ error: errorMessage });
    }
});
// Get a single book
router.get('/:id', auth_1.auth, async (req, res) => {
    try {
        const book = await storage_1.storage.getBookById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        return res.json(book);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return res.status(500).json({ error: errorMessage });
    }
});
// Add a new book
router.post('/', auth_1.auth, [
    (0, express_validator_1.body)('title').notEmpty(),
    (0, express_validator_1.body)('author').notEmpty(),
    (0, express_validator_1.body)('isbn').notEmpty(),
    (0, express_validator_1.body)('quantity').isInt({ min: 0 }),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const book = await storage_1.storage.createBook(req.body);
        return res.status(201).json(book);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return res.status(500).json({ error: errorMessage });
    }
});
// Update a book
router.put('/:id', auth_1.auth, [
    (0, express_validator_1.body)('title').optional(),
    (0, express_validator_1.body)('author').optional(),
    (0, express_validator_1.body)('isbn').optional(),
    (0, express_validator_1.body)('quantity').optional().isInt({ min: 0 }),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const book = await storage_1.storage.updateBook(req.params.id, req.body);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        return res.json(book);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return res.status(500).json({ error: errorMessage });
    }
});
exports.booksRouter = router;
