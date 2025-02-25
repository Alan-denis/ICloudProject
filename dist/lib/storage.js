"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const crypto_1 = require("crypto");
class LocalStorage {
    constructor() {
        this.users = new Map();
        this.books = new Map();
        this.borrows = new Map();
    }
    // User methods
    async createUser(user) {
        const id = (0, crypto_1.randomUUID)();
        const newUser = { ...user, id, created_at: new Date() };
        this.users.set(id, newUser);
        return newUser;
    }
    async getUserByEmail(email) {
        return Array.from(this.users.values()).find(user => user.email === email) || null;
    }
    async getUserById(id) {
        return this.users.get(id) || null;
    }
    async updateUser(id, data) {
        const user = this.users.get(id);
        if (!user)
            return null;
        const updatedUser = { ...user, ...data };
        this.users.set(id, updatedUser);
        return updatedUser;
    }
    // Book methods
    async createBook(book) {
        const id = (0, crypto_1.randomUUID)();
        const newBook = { ...book, id, created_at: new Date() };
        this.books.set(id, newBook);
        return newBook;
    }
    async getBooks() {
        return Array.from(this.books.values());
    }
    async getBookById(id) {
        return this.books.get(id) || null;
    }
    async updateBook(id, data) {
        const book = this.books.get(id);
        if (!book)
            return null;
        const updatedBook = { ...book, ...data };
        this.books.set(id, updatedBook);
        return updatedBook;
    }
    // Borrow methods
    async createBorrow(borrow) {
        const id = (0, crypto_1.randomUUID)();
        const newBorrow = { ...borrow, id, created_at: new Date() };
        this.borrows.set(id, newBorrow);
        return newBorrow;
    }
    async getUserBorrows(userId) {
        return Array.from(this.borrows.values()).filter(borrow => borrow.user_id === userId);
    }
    async updateBorrow(id, data) {
        const borrow = this.borrows.get(id);
        if (!borrow)
            return null;
        const updatedBorrow = { ...borrow, ...data };
        this.borrows.set(id, updatedBorrow);
        return updatedBorrow;
    }
}
exports.storage = new LocalStorage();
