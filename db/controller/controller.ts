import db from '../config/db';
import getBooks from './queries/getBooks';
import getDailyReads from './queries/getDailyReads';
import { Request, Response } from 'express';

const controller = {
    getCurrentlyReading: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const is_any_reading = true;
    try {
      const result = await db.query(getBooks(readerId, is_any_reading));
      res.status(200).json(result.rows[0].books);
    } catch (err) {
      res.sendStatus(400);
    }
  },

  getFinishedReading: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const is_any_reading = false;
    try {
      const result = await db.query(getBooks(readerId, is_any_reading));
      res.status(200).json(result.rows[0].books);
    } catch (err) {
      res.sendStatus(400);
    }
  },

  getDailyReads: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    try {
      const result = await db.query(getDailyReads(readerId));
      res.status(200).json(result.rows);
    } catch (err) {
      res.sendStatus(400);
    }
  }
}

export default controller;