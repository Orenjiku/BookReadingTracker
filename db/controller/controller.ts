import db from '../config/db';
import { Request, Response } from 'express';
import queryGetReading from './queries/queryGetReading';
import queryDailyReads from './queries/queryDailyReads';
import { queryGetReaderBook } from './queries/queryReaderBook';
import { queryPutTotalPages } from './queries/queryTotalPages';
import { queryPostAuthor, queryDeleteAuthor } from './queries/queryAuthor';
import { queryPostReadInstance, queryDeleteReadInstance } from './queries/queryReadInstance';
import { queryPostReadEntry, queryDeleteReadEntry } from './queries/queryReadEntry';
import { queryPostBook, queryDeleteBook } from './queries/queryBook';
import { queryPutTitle } from './queries/queryTitle';


const controller = {
    getCurrentlyReading: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    try {
      const result = await db.query(queryGetReading('isReading'), [readerId]);
      res.status(200).json(result.rows[0].books);
    } catch (err) {
      console.log(err)
      res.sendStatus(400);
    }
  },

  getFinishedReading: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    try {
      const result = await db.query(queryGetReading('isFinished'), [readerId]);
      res.status(200).json(result.rows[0].books);
    } catch (err) {
      res.sendStatus(400);
    }
  },

  getDailyReads: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    try {
      const result = await db.query(queryDailyReads(), [readerId]);
      res.status(200).json(result.rows);
    } catch (err) {
      res.sendStatus(200);
    }
  },

  postBook: async (req: Request, res: Response) => {
    const readerId = req.params.id;
    const { title, titleSort, format, totalPages, author, publishedDate, editionDate, bookCoverUrl, blurb, category } = req.body;
    const pgSqlAuthor = JSON.stringify(author).replace(/^\[/, "{").replace(/\]$/, "}"); //convert to ["author one", "author two"] to {"author one", "author two"}
    const pgSqlBlurb = blurb.replace(/'/g, "''"); //provide escape single quotes for sql formatting.
    try {
      await db.query(queryPostBook(readerId, title, titleSort, format, totalPages, pgSqlAuthor, publishedDate, editionDate, bookCoverUrl, pgSqlBlurb));
      const result = await db.query(queryGetReading(category), [readerId]);
      res.status(200).json(result.rows[0].books);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  deleteBook: async(req: Request, res: Response) => {
    const readerId = req.params.id;
    const { bookId, category } = req.body; //bookList = 'isReading' || 'isFinished' || 'isDNF' || 'isCollection'
    try {
      await db.query(queryDeleteBook(bookId));
      const result = await db.query(queryGetReading(category), [readerId]);
      res.status(200).json(result.rows[0].books);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  putTitle: async (req: Request, res: Response) => {
    const { bookId, title, titleSort }: { bookId: number, title: string, titleSort: string } = req.body;
    try {
      await db.query(queryPutTitle(bookId, title, titleSort));
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      err.detail === `Key (title_sort)=(${titleSort}) already exists.` ? res.status(500).json(err.detail) : res.sendStatus(400);
    }
  },

  postAuthor: async (req: Request, res: Response) => {
    const { bookId, authorList }: { bookId: number, authorList: string[] } = req.body;
    try {
      await db.query(queryPostAuthor(bookId, authorList));
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  deleteAuthor: async (req: Request, res: Response) => {
    const { bookId, authorList }: { bookId: number, authorList: string[] } = req.body;
    try {
      await db.query(queryDeleteAuthor(bookId, authorList));
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  putBookFormat: async (req: Request, res: Response) => {
    const { bookId, format }: { bookId: number, format: string } = req.body;
    try {
      await db.query(`UPDATE book SET book_format=$2 WHERE book.id=$1;`, [bookId, format]);
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  putTotalPages: async (req: Request, res: Response) => {
    const { bookId, readerBookId, totalPages }: {bookId: number, readerBookId: number, totalPages: number} = req.body;
    try {
      await db.query(`BEGIN; ${queryPutTotalPages( bookId, readerBookId, totalPages)} COMMIT;`);
      const result = await db.query(queryGetReaderBook(), [readerBookId]);
      res.status(200).json(result.rows[0].reader_book);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  putPublishedDate: async (req: Request, res: Response) => {
    const { bookId, publishedDate }: { bookId: number, publishedDate: string } = req.body;
    try {
      await db.query(`UPDATE book SET published_date=$2 WHERE book.id=$1;`, [bookId, publishedDate]);
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  putEditionDate: async (req: Request, res: Response) => {
    const { bookId, editionDate }: { bookId: number, editionDate: string } = req.body;
    try {
      await db.query(`UPDATE book SET edition_date=$2 WHERE book.id=$1;`, [bookId, editionDate]);
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  putBookCoverUrl: async (req: Request, res: Response) => {
    const { bookId, bookCoverUrl }: { bookId: number, bookCoverUrl: string } = req.body;
    try {
      await db.query(`UPDATE book SET book_cover_url=$2 WHERE book.id=$1;`, [bookId, bookCoverUrl]);
      res.sendStatus(204);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  putBlurb: async (req: Request, res: Response) => {
    const { bookId, blurb }: { bookId: number, blurb: string } = req.body;
    try {
      const result = await db.query(`UPDATE book SET blurb=$2 WHERE book.id=$1;`, [bookId, blurb]);
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
      const result = await db.query(queryGetReaderBook(), [readerBookId]);
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
      const result = await db.query(queryGetReaderBook(), [readerBookId]);
      res.status(200).json(result.rows[0].reader_book);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  postReadEntry: async (req: Request, res: Response) => {
    const { readerBookId, readInstanceId, dateString, currentPage, totalPages }: { readerBookId: number, readInstanceId: number, dateString: string, currentPage: number, totalPages: number } = req.body;
    try {
      await db.query(`BEGIN; ${queryPostReadEntry(readerBookId, readInstanceId, dateString, currentPage, totalPages)} COMMIT;`);
      const result = await db.query(queryGetReaderBook(), [readerBookId]);
      res.status(200).json(result.rows[0].reader_book);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  deleteReadEntry: async (req: Request, res: Response) => {
    const { readerBookId, readInstanceId, readEntryId, readEntryPagesRead }: { readerBookId: number, readInstanceId: number, readEntryId: number, readEntryPagesRead: number } = req.body;
    try {
      await db.query(`BEGIN; ${queryDeleteReadEntry(readerBookId, readInstanceId, readEntryId, readEntryPagesRead)} COMMIT;`);
      const result = await db.query(queryGetReaderBook(), [readerBookId]);
      res.status(200).json(result.rows[0].reader_book);
    } catch(err) {
      console.error(err);
      res.sendStatus(400);
    }
  }
}

export default controller;