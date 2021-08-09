import { PoolConfig } from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({path: path.join(__dirname, '/.env')})

const dbConfig: PoolConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT as string, 10)
}

export default dbConfig;