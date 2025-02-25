import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { booksRouter } from './routes/books';
import { usersRouter } from './routes/users';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/books', booksRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`i-cloud Management System running on port ${port}`);
});