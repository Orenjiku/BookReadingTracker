/* --------------------------------------------- CREATE TABLE --------------------------------------------- */
CREATE TABLE reader (
  id INT GENERATED ALWAYS AS IDENTITY CONSTRAINT pk_reader PRIMARY KEY,
  username VARCHAR CONSTRAINT uq_reader_username UNIQUE NOT NULL,
  email VARCHAR CONSTRAINT uq_reader_email UNIQUE NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL
);

CREATE INDEX ix_reader_username ON reader (username);

CREATE TABLE book (
  id INT GENERATED ALWAYS AS IDENTITY CONSTRAINT pk_book PRIMARY KEY,
  title VARCHAR CONSTRAINT uq_book_title UNIQUE NOT NULL,
  title_sort VARCHAR NOT NULL,
  published_date DATE,
  published_date_edition DATE,
  book_format VARCHAR,
  total_pages INT,
  blurb TEXT,
  picture_link VARCHAR,
  CONSTRAINT ck_book_total_pages CHECK (total_pages > 0)
);

CREATE INDEX ix_book_title ON book (title);

CREATE TABLE reader_book (
  id INT GENERATED ALWAYS AS IDENTITY CONSTRAINT pk_reader_book PRIMARY KEY,
  days_read_lifetime INT DEFAULT 0,
  days_total_lifetime INT DEFAULT 0,
  max_daily_read_lifetime INT DEFAULT 0,
  read_count INT DEFAULT 1,
  is_any_reading BOOLEAN DEFAULT FALSE,
  is_all_dnf BOOLEAN DEFAULT FALSE,
  reader_id INT,
  book_id INT,
  CONSTRAINT fk_reader_reader_book
    FOREIGN KEY (reader_id) REFERENCES reader (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_book_reader_book
    FOREIGN KEY (book_id) REFERENCES book (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX ix_reader_book_reader_id ON reader_book (reader_id);
CREATE INDEX ix_reader_book_book_id ON reader_book (book_id);

CREATE TABLE read_instance (
  id INT GENERATED ALWAYS AS IDENTITY CONSTRAINT pk_read_instance PRIMARY KEY,
  days_read INT DEFAULT 0,
  days_total INT DEFAULT 0,
  max_daily_read INT DEFAULT 0,
  is_reading BOOLEAN DEFAULT FALSE,
  is_finished BOOLEAN DEFAULT FALSE,
  is_dnf BOOLEAN DEFAULT FALSE,
  reader_book_id INT,
  CONSTRAINT fk_reader_book_read_instance
    FOREIGN KEY (reader_book_id) REFERENCES reader_book (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX ix_read_instance_reader_book_id ON read_instance (reader_book_id);

CREATE TABLE read_entry (
  id INT GENERATED ALWAYS AS IDENTITY CONSTRAINT pk_read_entry PRIMARY KEY,
  date_read TIMESTAMP (0) WITH TIME ZONE NOT NULL,
  pages_read INT NOT NULL,
  current_page INT NOT NULL,
  current_percent DECIMAL NOT NULL,
  read_instance_id INT,
  CONSTRAINT fk_read_instance_read_entry
    FOREIGN KEY (read_instance_id) REFERENCES read_instance (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT ck_current_percent CHECK (current_percent >= 0.00 AND current_percent <= 100.00)
);

CREATE INDEX ix_read_entry_read_instance_id ON read_entry (read_instance_id);

CREATE TABLE author (
  id INT GENERATED ALWAYS AS IDENTITY CONSTRAINT pk_author PRIMARY KEY,
  full_name VARCHAR CONSTRAINT uq_author_full_name UNIQUE NOT NULL,
  first_name VARCHAR NOT NULL,
  middle_name VARCHAR DEFAULT '',
  last_name VARCHAR NOT NULL
);

CREATE INDEX ix_author_full_name ON author (full_name);

CREATE TABLE book_author (
  id INT GENERATED ALWAYS AS IDENTITY CONSTRAINT pk_book_author PRIMARY KEY,
  book_id INT,
  author_id INT,
  CONSTRAINT fk_book_book_author
    FOREIGN KEY (book_id) REFERENCES book (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_author_book_author
    FOREIGN KEY (author_id) REFERENCES author (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX ix_book_author_book_id ON book_author (book_id);
CREATE INDEX ix_book_author_author_id ON book_author (author_id);