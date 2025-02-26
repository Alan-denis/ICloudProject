import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'data-container',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'database',
  user: process.env.POSTGRES_USER || 'user',
  password: process.env.POSTGRES_PASSWORD || 'password',
});

export default pool;