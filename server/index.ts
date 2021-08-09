import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();
import routes from '../db/routes/index';

const app = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join( __dirname, './../build' )));

app.use('/', routes);

app.listen(PORT, () => console.log(`App listening on ${PORT}`));