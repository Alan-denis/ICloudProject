import { randomUUID } from 'crypto';

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

class LocalStorage {
  private users: Map<string, User> = new Map();
  private books: Map<string, Book> = new Map();
  private borrows: Map<string, Borrow> = new Map();

  // User methods
  async createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const id = randomUUID();
    const newUser = { ...user, id, created_at: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return Array.from(this.users.values()).find(user => user.email === email) || null;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Book methods
  async createBook(book: Omit<Book, 'id' | 'created_at'>): Promise<Book> {
    const id = randomUUID();
    const newBook = { ...book, id, created_at: new Date() };
    this.books.set(id, newBook);
    return newBook;
  }

  async getBooks(): Promise<Book[]> {
    return Array.from(this.books.values());
  }

  async getBookById(id: string): Promise<Book | null> {
    return this.books.get(id) || null;
  }

  async updateBook(id: string, data: Partial<Book>): Promise<Book | null> {
    const book = this.books.get(id);
    if (!book) return null;
    const updatedBook = { ...book, ...data };
    this.books.set(id, updatedBook);
    return updatedBook;
  }

  // Borrow methods
  async createBorrow(borrow: Omit<Borrow, 'id' | 'created_at'>): Promise<Borrow> {
    const id = randomUUID();
    const newBorrow = { ...borrow, id, created_at: new Date() };
    this.borrows.set(id, newBorrow);
    return newBorrow;
  }

  async getUserBorrows(userId: string): Promise<Borrow[]> {
    return Array.from(this.borrows.values()).filter(borrow => borrow.user_id === userId);
  }

  async updateBorrow(id: string, data: Partial<Borrow>): Promise<Borrow | null> {
    const borrow = this.borrows.get(id);
    if (!borrow) return null;
    const updatedBorrow = { ...borrow, ...data };
    this.borrows.set(id, updatedBorrow);
    return updatedBorrow;
  }
}

export const storage = new LocalStorage();