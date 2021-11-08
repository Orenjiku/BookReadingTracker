import db from '../config/db';
import { Request, Response } from 'express';
import queryReading from './queries/queryReading';
import queryDailyReads from './queries/queryDailyReads';
import { queryPutTotalPages } from './queries/queryTotalPages';
import { queryPostAuthor, queryDeleteAuthor } from './queries/queryAuthor';
import { queryPostReadEntry, queryDeleteReadEntry } from './queries/queryReadEntry';
import { queryGetReaderBook } from './queries/queryReaderBook';


const controller = {
    getCurrentlyReading: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const isReading = true;
    try {
      const result = await db.query(queryReading(readerId, isReading));
      res.status(200).json(result.rows[0].books);
    } catch (err) {
      res.sendStatus(400);
    }
  },

  getFinishedReading: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const isReading = false;
    try {
      const result = await db.query(queryReading(readerId, isReading));
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
    // const readerId = req.params.id;
    const { bookId, title }: { bookId: number, title: string } = req.body;
    const titleWords = title.toLowerCase().split(/\s+/);
    const titleSort = titleWords[0] === 'the' ? `${titleWords.slice(1).join(' ')}, the` : titleWords.join(' ');
    try {
      await db.query(`UPDATE book SET title='${title}', title_sort='${titleSort}' WHERE book.id=${bookId};`);
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      err.detail === `Key (title)=(${title}) already exists.` ? res.status(500).json(err.detail) : res.sendStatus(400);
    }
  },

  postAuthor: async (req: Request, res: Response) => {
    // const readerId = req.params.id;
    const { bookId, authorList }: { bookId: number, authorList: string[] } = req.body;
    try {
      await db.query(`BEGIN; ${queryPostAuthor(bookId, authorList)} COMMIT`);
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  deleteAuthor: async (req: Request, res: Response) => {
    // const readerId = req.params.id;
    const { bookId, authorList }: { bookId: number, authorList: string[] } = req.body;
    try {
      await db.query(`BEGIN; ${queryDeleteAuthor(bookId, authorList)} COMMIT;`);
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
      await db.query(`UPDATE book SET picture_url='${bookCoverUrl}' WHERE book.id=${bookId};`);
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
  }
}

export default controller;