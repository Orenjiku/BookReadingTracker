export interface ReadEntryITF {
  re_id: number;
  date_read: Date;
  pages_read: number;
  current_page: number;
  current_percent: number;
}

export interface ReadInstanceITF {
  ri_id: number;
  days_read: number;
  days_total: number;
  pages_read: number;
  max_daily_read: number;
  is_reading: boolean;
  is_finished: boolean;
  is_dnf: boolean;
  reader_book_id: number;
  read_entry: ReadEntryITF[];
}

export interface ReaderBookITF {
  rb_id: number;
  is_any_reading: boolean;
  is_any_finished: boolean;
  is_all_dnf: boolean;
  read_instance: ReadInstanceITF[];
}

export type BookListCategory = 'isReading' | 'isFinished' | 'isDNF' | 'isCollection';

export interface BookDetailsITF {
  b_id: number;
  title: string;
  titleSort: string;
  book_format: string;
  total_pages: number;
  published_date: string;
  edition_date: string;
  book_cover_url: string;
  blurb: string;
  category: BookListCategory; //property mapped as props to Card components from routes files.
}

export interface BookITF extends BookDetailsITF {
  author: string[];
  reader_book: ReaderBookITF;
}