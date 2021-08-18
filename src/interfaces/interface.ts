export interface ReadEntryITF {
  re_id: number;
  date_read: Date;
  pages_read: number;
  current_page: number;
  current_percent: number;
}

export interface BookReadITF {
  br_id: number;
  days_read: number;
  days_total: number;
  read_entry?: ReadEntryITF[];
}

export interface BookITF {
  b_id: number;
  title: string;
  author: string[];
  total_pages: number;
  blurb: string;
  picture_link: string;
  book_read: BookReadITF[];
}