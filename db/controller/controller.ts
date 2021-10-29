import db from '../config/db';
import queryCurrentlyReading from './queries/queryCurrentlyReading';
import queryFinishedReading from './queries/queryFinishedReading';
import queryDailyReads from './queries/queryDailyReads';
import { queryPostAuthor, queryDeleteAuthor } from './queries/queryAuthor';
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
      res.sendStatus(200);
    }
  },

  putTitle: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const { bookId, title } = req.body;
    console.log(bookId, title);
    try {
      await db.query(`UPDATE book SET title='${title}' WHERE book.id=${bookId}`)
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      err.detail === `Key (title)=(${title}) already exists.` ? res.status(500).json(err.detail) : res.sendStatus(400);
    }
  },

  postAuthor: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const { bookId, authorList } = req.body;
    try {
      await db.query(queryPostAuthor(bookId, authorList));
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  deleteAuthor: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const { bookId, authorList } = req.body;
    try {
      await db.query(queryDeleteAuthor(bookId, authorList));
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  putBookFormat: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const { bookId, format } = req.body;
    try {
      await db.query(`Update book SET book_format='${format}' WHERE book.id=${bookId}`);
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  putTotalPages: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const { bookId, totalPages} = req.body;
    //change to totalPages require update to readEntry currentPercent
    res.sendStatus(200);
  },

  putPublishedDate: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const { bookId, publishedDate } = req.body;
    try {
      await db.query(`UPDATE book SET published_date='${publishedDate}' WHERE book.id=${bookId}`);
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  putEditionDate: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const { bookId, editionDate } = req.body;
    try {
      await db.query(`UPDATE book SET edition_date='${editionDate}' WHERE book.id=${bookId}`);
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  putPictureUrl: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const { bookId, pictureUrl } = req.body;
    try {
      await db.query(`UPDATE book SET picture_url='${pictureUrl}' WHERE book.id=${bookId}`);
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  putBlurb: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const { bookId, blurb } = req.body;
    try {
      const result = await db.query(`UPDATE book SET blurb='${blurb}' WHERE book.id=${bookId}`);
      console.log(result)
      res.sendStatus(204);
    } catch(err) {
      console.log(err);
      res.sendStatus(400);
    }
  }
}

export default controller;