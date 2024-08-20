import { Pool } from 'pg';

export const pool = new Pool({
  user: process.env.PG_USER_NAME,
  host: process.env.PG_HOST_NAME,
  database: process.env.PG_DB_NAME,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
