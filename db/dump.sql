/* psql -h hostname -U username -f {SQL script file name}*/

/* change database name with {test} below */
\set my_db test
DROP DATABASE IF EXISTS :my_db;
CREATE DATABASE :my_db;
\c :my_db

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
  total_pages INT,
  book_description TEXT,
  picture_link VARCHAR
);

CREATE INDEX ix_book_title ON book (title);

CREATE TABLE reader_book (
  id INT GENERATED ALWAYS AS IDENTITY CONSTRAINT pk_reader_book PRIMARY KEY,
  reader_id INT,
  book_id INT,
  CONSTRAINT fk_reader_reader_book
    FOREIGN KEY (reader_id) REFERENCES reader (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_book_reader_book
    FOREIGN KEY (book_id) REFERENCES book (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX ix_reader_book_reader_id ON reader_book (reader_id);

CREATE TABLE book_read (
  id INT GENERATED ALWAYS AS IDENTITY CONSTRAINT pk_book_read PRIMARY KEY,
  days_read INT DEFAULT 0,
  days_total INT DEFAULT 0,
  is_complete BOOLEAN DEFAULT FALSE,
  is_reading BOOLEAN DEFAULT FALSE,
  reader_book_id INT,
  CONSTRAINT fk_reader_book_book_read
    FOREIGN KEY (reader_book_id) REFERENCES reader_book (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX ix_book_read_reader_book_id ON book_read (reader_book_id);

CREATE TABLE read_entry (
  id INT GENERATED ALWAYS AS IDENTITY CONSTRAINT pk_read_entry PRIMARY KEY,
  date_read DATE NOT NULL,
  page_completed INT NOT NULL,
  percentage_completed INT NOT NULL,
  book_read_id INT,
  CONSTRAINT fk_book_read_read_entry
    FOREIGN KEY (book_read_id) REFERENCES book_read (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX ix_read_entry_book_read_id ON read_entry (book_read_id);

CREATE TABLE author (
  id INT GENERATED ALWAYS AS IDENTITY CONSTRAINT pk_author PRIMARY KEY,
  author_name VARCHAR CONSTRAINT uq_author_author_name UNIQUE NOT NULL
);

CREATE TABLE book_author (
  id INT GENERATED ALWAYS AS IDENTITY CONSTRAINT pk_book_author PRIMARY KEY,
  book_id INT,
  author_id INT,
  CONSTRAINT fk_book_book_author
    FOREIGN KEY (book_id) REFERENCES book (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_author_book_author
    FOREIGN KEY (author_id) REFERENCES author (id) ON DELETE CASCADE ON UPDATE CASCADE
);