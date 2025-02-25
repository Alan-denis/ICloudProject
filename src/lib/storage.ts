import { randomUUID } from 'crypto';
import db from './db';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  created_at: Date;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  created_at: Date;
}

export interface Borrow {
  id: string;
  user_id: string;
  book_id: string;
  borrow_date: Date;
  return_date?: Date;
  returned: boolean;
  created_at: Date;
}

class PostgresStorage {
  // User methods
  async createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const result = await db.query(
      'INSERT INTO users (email, password, name, phone) VALUES ($1, $2, $3, $4) RETURNING *',
      [user.email, user.password, user.name, user.phone]
    );
    return result.rows[0];
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    const fields = Object.keys(data).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = Object.values(data);
    
    const result = await db.query(
      `UPDATE users SET ${fields} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0] || null;
  }

  // Book methods
  async createBook(book: Omit<Book, 'id' | 'created_at'>): Promise<Book> {
    const result = await db.query(
      'INSERT INTO books (title, author, isbn, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
      [book.title, book.author, book.isbn, book.quantity]
    );
    return result.rows[0];
  }

  async getBooks(): Promise<Book[]> {
    const result = await db.query('SELECT * FROM books');
    return result.rows;
  }

  async getBookById(id: string): Promise<Book | null> {
    const result = await db.query('SELECT * FROM books WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async updateBook(id: string, data: Partial<Book>): Promise<Book | null> {
    const fields = Object.keys(data).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = Object.values(data);
    
    const result = await db.query(
      `UPDATE books SET ${fields} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0] || null;
  }

  // Borrow methods
  async createBorrow(borrow: Omit<Borrow, 'id' | 'created_at'>): Promise<Borrow> {
    const result = await db.query(
      'INSERT INTO borrows (user_id, book_id, borrow_date, return_date, returned) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [borrow.user_id, borrow.book_id, borrow.borrow_date, borrow.return_date, borrow.returned]
    );
    return result.rows[0];
  }

  async getUserBorrows(userId: string): Promise<Borrow[]> {
    const result = await db.query('SELECT * FROM borrows WHERE user_id = $1', [userId]);
    return result.rows;
  }

  async updateBorrow(id: string, data: Partial<Borrow>): Promise<Borrow | null> {
    const fields = Object.keys(data).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = Object.values(data);
    
    const result = await db.query(
      `UPDATE borrows SET ${fields} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0] || null;
  }
}

export const storage = new PostgresStorage();