import { Pool } from 'pg';
import dbConfig from './db.config';

export default new Pool(dbConfig);