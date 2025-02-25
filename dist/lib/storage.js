"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const db_1 = __importDefault(require("./db"));
class PostgresStorage {
    // User methods
    async createUser(user) {
        const result = await db_1.default.query('INSERT INTO users (email, password, name, phone) VALUES ($1, $2, $3, $4) RETURNING *', [user.email, user.password, user.name, user.phone]);
        return result.rows[0];
    }
    async getUserByEmail(email) {
        const result = await db_1.default.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0] || null;
    }
    async getUserById(id) {
        const result = await db_1.default.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0] || null;
    }
    async updateUser(id, data) {
        const fields = Object.keys(data).map((key, i) => `${key} = $${i + 2}`).join(', ');
        const values = Object.values(data);
        const result = await db_1.default.query(`UPDATE users SET ${fields} WHERE id = $1 RETURNING *`, [id, ...values]);
        return result.rows[0] || null;
    }
    // Book methods
    async createBook(book) {
        const result = await db_1.default.query('INSERT INTO books (title, author, isbn, quantity) VALUES ($1, $2, $3, $4) RETURNING *', [book.title, book.author, book.isbn, book.quantity]);
        return result.rows[0];
    }
    async getBooks() {
        const result = await db_1.default.query('SELECT * FROM books');
        return result.rows;
    }
    async getBookById(id) {
        const result = await db_1.default.query('SELECT * FROM books WHERE id = $1', [id]);
        return result.rows[0] || null;
    }
    async updateBook(id, data) {
        const fields = Object.keys(data).map((key, i) => `${key} = $${i + 2}`).join(', ');
        const values = Object.values(data);
        const result = await db_1.default.query(`UPDATE books SET ${fields} WHERE id = $1 RETURNING *`, [id, ...values]);
        return result.rows[0] || null;
    }
    // Borrow methods
    async createBorrow(borrow) {
        const result = await db_1.default.query('INSERT INTO borrows (user_id, book_id, borrow_date, return_date, returned) VALUES ($1, $2, $3, $4, $5) RETURNING *', [borrow.user_id, borrow.book_id, borrow.borrow_date, borrow.return_date, borrow.returned]);
        return result.rows[0];
    }
    async getUserBorrows(userId) {
        const result = await db_1.default.query('SELECT * FROM borrows WHERE user_id = $1', [userId]);
        return result.rows;
    }
    async updateBorrow(id, data) {
        const fields = Object.keys(data).map((key, i) => `${key} = $${i + 2}`).join(', ');
        const values = Object.values(data);
        const result = await db_1.default.query(`UPDATE borrows SET ${fields} WHERE id = $1 RETURNING *`, [id, ...values]);
        return result.rows[0] || null;
    }
}
exports.storage = new PostgresStorage();
