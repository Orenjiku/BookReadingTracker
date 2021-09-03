export interface ReadEntryITF {
  re_id: number;
  date_read: Date;
  pages_read: number;
  current_page: number;
  current_percent: number;
}

export interface ReaderBookITF {
  rb_id: number;
  days_read: number;
  days_total: number;
  is_reading: boolean;
  is_finished: boolean;
  read_entry?: ReadEntryITF[];
}

export interface BookITF {
  b_id: number;
  title: string;
  author: string[];
  total_pages: number;
  blurb: string;
  picture_link: string;
  reader_book: ReaderBookITF[];
}