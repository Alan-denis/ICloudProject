"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const storage_1 = require("../lib/storage");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get user profile
router.get('/profile', auth_1.auth, async (req, res) => {
    try {
        const user = await storage_1.storage.getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(user);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return res.status(500).json({ error: errorMessage });
    }
});
// Update user profile
router.put('/profile', auth_1.auth, [
    (0, express_validator_1.body)('name').optional(),
    (0, express_validator_1.body)('phone').optional(),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await storage_1.storage.updateUser(req.user.id, req.body);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(user);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return res.status(500).json({ error: errorMessage });
    }
});
exports.usersRouter = router;
