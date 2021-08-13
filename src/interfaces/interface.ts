export interface ReadEntry {
  re_id: number;
  date_read: Date;
  current_page: number;
  current_percent: number;
}

export interface BookRead {
  br_id: number;
  days_read: number;
  days_total: number;
  read_entry?: Array<ReadEntry>;
}

export interface Book {
  b_id: number;
  title: string;
  author: string[];
  total_pages: number;
  blurb: string;
  picture_link: string;
  book_read?: Array<BookRead>;
}