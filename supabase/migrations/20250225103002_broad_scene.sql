/*
  # Initial Library Management System Schema

  1. New Tables
    - `books`
      - `id` (uuid, primary key)
      - `title` (text)
      - `author` (text)
      - `isbn` (text, unique)
      - `quantity` (integer)
      - `created_at` (timestamp)
    - `users` (extends Supabase auth.users)
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `phone` (text, optional)
      - `created_at` (timestamp)
    - `borrows`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `book_id` (uuid, references books)
      - `borrow_date` (timestamp)
      - `return_date` (timestamp)
      - `returned` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  isbn text UNIQUE NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users,
  name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Borrows table
CREATE TABLE IF NOT EXISTS borrows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  book_id uuid REFERENCES books NOT NULL,
  borrow_date timestamptz DEFAULT now(),
  return_date timestamptz,
  returned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrows ENABLE ROW LEVEL SECURITY;

-- Books Policies
CREATE POLICY "Anyone can view books"
  ON books
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only librarians can modify books"
  ON books
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'librarian');

-- Users Policies
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Borrows Policies
CREATE POLICY "Users can view their own borrows"
  ON borrows
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own borrows"
  ON borrows
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own borrows"
  ON borrows
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);