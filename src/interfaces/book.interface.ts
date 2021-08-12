import BookRead from './bookRead.interface';

export default interface Book {
  b_id: number;
  title: string;
  author: string[];
  total_pages: number;
  blurb: string;
  picture_link: string;
  book_read?: Array<BookRead>;
}