import db from '../config/db';
import getBooks from './queries/getBooks';
import getDailyReads from './queries/getDailyReads';
import { Request, Response } from 'express';

const controller = {
    getCurrentlyReading: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const isReading = true;
    const isFinished = false;
    try {
      const result = await db.query(getBooks(readerId, isReading, isFinished));
      res.status(200).json(result.rows[0].books);
    } catch (err) {
      res.sendStatus(400);
    }
  },

  getFinishedReading: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const isReading = false;
    const isFinished = true;
    try {
      const result = await db.query(getBooks(readerId, isReading, isFinished));
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