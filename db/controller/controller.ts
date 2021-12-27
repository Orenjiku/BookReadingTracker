import db from '../config/db';
import { Request, Response } from 'express';
import queryGetReading from './queries/queryGetReading';
import queryDailyReads from './queries/queryDailyReads';
import { queryGetReaderBook } from './queries/queryReaderBook';
import { queryPutTotalPages } from './queries/queryTotalPages';
import { queryPostAuthor, queryDeleteAuthor } from './queries/queryAuthor';
import { queryPostReadInstance, queryDeleteReadInstance } from './queries/queryReadInstance';
import { queryPostReadEntry, queryDeleteReadEntry } from './queries/queryReadEntry';
import { queryPostBook } from './queries/queryBook';


const controller = {
    getCurrentlyReading: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const isReading = true;
    try {
      const result = await db.query(queryGetReading(readerId, isReading));
      res.status(200).json(result.rows[0].books);
    } catch (err) {
      res.sendStatus(400);
    }
  },

  getFinishedReading: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const isReading = false;
    try {
      const result = await db.query(queryGetReading(readerId, isReading));
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
    const { bookId, title, titleSort }: { bookId: number, title: string, titleSort: string } = req.body;
    try {
      await db.query(`UPDATE book SET title='${title}', title_sort='${titleSort}' WHERE book.id=${bookId};`);
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      err.detail === `Key (title)=(${title}) already exists.` ? res.status(500).json(err.detail) : res.sendStatus(400);
    }
  },

  postAuthor: async (req: Request, res: Response) => {
    const { bookId, authorList }: { bookId: number, authorList: string[] } = req.body;
    try {
      await db.query(`${queryPostAuthor(bookId, authorList)}`); //Method 1: use plpgsql. See queryAuthor.ts
      // await db.query(`BEGIN; ${queryPostAuthor(bookId, authorList)} COMMIT`); //Method 2: multiple CTE queries.
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  deleteAuthor: async (req: Request, res: Response) => {
    const { bookId, authorList }: { bookId: number, authorList: string[] } = req.body;
    try {
      await db.query(`${queryDeleteAuthor(bookId, authorList)}`); //Method 1:use plpgsql. See queryAuthor.ts
      // await db.query(`BEGIN; ${queryDeleteAuthor(bookId, authorList)} COMMIT;`); //Method 2: multiple CTE queries.
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  putBookFormat: async (req: Request, res: Response) => {
    // const readerId = req.params.id;
    const { bookId, format }: { bookId: number, format: string } = req.body;
    try {
      await db.query(`UPDATE book SET book_format='${format}' WHERE book.id=${bookId};`);
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  putTotalPages: async (req: Request, res: Response) => {
    // const readerId = req.params.id;
    const { bookId, readerBookId, totalPages }: {bookId: number, readerBookId: number, totalPages: number} = req.body;
    try {
      await db.query(`BEGIN; ${queryPutTotalPages( bookId, readerBookId, totalPages)} COMMIT;`);
      const result = await db.query(queryGetReaderBook(readerBookId));
      res.status(200).json(result.rows[0].reader_book);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  putPublishedDate: async (req: Request, res: Response) => {
    // const readerId = req.params.id;
    const { bookId, publishedDate }: { bookId: number, publishedDate: string } = req.body;
    try {
      await db.query(`UPDATE book SET published_date='${publishedDate}' WHERE book.id=${bookId};`);
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  putEditionDate: async (req: Request, res: Response) => {
    // const readerId = req.params.id;
    const { bookId, editionDate }: { bookId: number, editionDate: string } = req.body;
    try {
      await db.query(`UPDATE book SET edition_date='${editionDate}' WHERE book.id=${bookId};`);
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  putBookCoverUrl: async (req: Request, res: Response) => {
    // const readerId = req.params.id;
    const { bookId, bookCoverUrl }: { bookId: number, bookCoverUrl: string } = req.body;
    try {
      await db.query(`UPDATE book SET book_cover_url='${bookCoverUrl}' WHERE book.id=${bookId};`);
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  putBlurb: async (req: Request, res: Response) => {
    // const readerId = req.params.id;
    const { bookId, blurb }: { bookId: number, blurb: string } = req.body;
    try {
      const result = await db.query(`UPDATE book SET blurb='${blurb}' WHERE book.id=${bookId};`);
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  postReadInstance: async (req: Request, res: Response) => {
    const { readerBookId }: { readerBookId: number } = req.body;
    try {
      await db.query(`BEGIN; ${queryPostReadInstance(readerBookId)} COMMIT;`);
      const result = await db.query(queryGetReaderBook(readerBookId));
      res.status(200).json(result.rows[0].reader_book);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  deleteReadInstance: async (req: Request, res: Response) => {
    const { readerBookId, readInstanceId }: { readerBookId: number, readInstanceId: number } = req.body;
    try {
      await db.query(`BEGIN; ${queryDeleteReadInstance(readerBookId, readInstanceId)} COMMIT;`);
      const result = await db.query(queryGetReaderBook(readerBookId));
      res.status(200).json(result.rows[0].reader_book);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  postReadEntry: async (req: Request, res: Response) => {
    // const readerId: string = req.params.id;
    const { readerBookId, readInstanceId, dateString, currentPage, totalPages }: { readerBookId: number, readInstanceId: number, dateString: string, currentPage: number, totalPages: number } = req.body;
    try {
      await db.query(`BEGIN; ${queryPostReadEntry(readerBookId, readInstanceId, dateString, currentPage, totalPages)} COMMIT;`);
      const result = await db.query(queryGetReaderBook(readerBookId));
      res.status(200).json(result.rows[0].reader_book);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  deleteReadEntry: async (req: Request, res: Response) => {
    const readerId: string = req.params.id;
    const { readerBookId, readInstanceId, readEntryId, readEntryPagesRead }: { readerBookId: number, readInstanceId: number, readEntryId: number, readEntryPagesRead: number } = req.body;
    try {
      await db.query(`BEGIN; ${queryDeleteReadEntry(readerBookId, readInstanceId, readEntryId, readEntryPagesRead)} COMMIT;`);
      const result = await db.query(queryGetReaderBook(readerBookId));
      res.status(200).json(result.rows[0].reader_book);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  postBook : async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const { title, titleSort, format, totalPages, author, publishedDate, editionDate, bookCoverUrl, blurb } = req.body;
    try {
      const result = await db.query(queryPostBook(readerId, title, titleSort, format, totalPages, author, publishedDate, editionDate, bookCoverUrl, blurb));
      // const result = await db.query();
      res.sendStatus(200);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  }
}

export default controller;