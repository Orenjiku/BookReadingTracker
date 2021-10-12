import db from '../config/db';
import queryCurrentlyReading from './queries/queryCurrentlyReading';
import queryFinishedReading from './queries/queryFinishedReading';
import queryDailyReads from './queries/queryDailyReads';
import { Request, Response } from 'express';

const controller = {
    getCurrentlyReading: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    try {
      const result = await db.query(queryCurrentlyReading(readerId));
      res.status(200).json(result.rows[0].books);
    } catch (err) {
      res.sendStatus(400);
    }
  },

  getFinishedReading: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    try {
      const result = await db.query(queryFinishedReading(readerId));
      res.status(200).json(result.rows[0].books);
    } catch (err) {
      res.sendStatus(400);
    }
  },

  getDailyReads: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    try {
      const result = await db.query(queryDailyReads(readerId));
      res.status(200).json(result.rows);
    } catch (err) {
      res.sendStatus(400);
    }
  },

  postTitle: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const { b_id, title } = req.body;
    console.log(b_id, title);
    res.sendStatus(200);
  },

  postBookFormat: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const { b_id, book_format } = req.body;
    console.log(b_id, book_format);
    res.sendStatus(200);
  }
}

export default controller;