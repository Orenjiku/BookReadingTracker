CREATE TABLE user_profile (
  id INT GENERATED ALWAYS AS IDENTITY CONSTRAINT pk_user_profile PRIMARY KEY,
  username VARCHAR CONSTRAINT uq_user_profile_username UNIQUE NOT NULL,
  email VARCHAR CONSTRAINT uq_user_profile_email UNIQUE NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL
);

CREATE INDEX ix_user_profile_id ON user_profile (username);

CREATE TABLE book (
  id INT GENERATED ALWAYS AS IDENTITY CONSTRAINT pk_book PRIMARY KEY,
  title VARCHAR CONSTRAINT uq_book_title UNIQUE NOT NULL,
  title_sort VARCHAR NOT NULL,
  total_pages INT,
  book_description TEXT,
  picture_link VARCHAR,
);

CREATE TABLE user_profile_book (
  id INT GENERATED ALWAYS AS IDENTITY CONSTRAINT pk_user_profile_book PRIMARY KEY,
  user_profile_id INT,
  book_id INT,
  CONSTRAINT fk_user_profile_user_profile_book
    FOREIGN KEY (user_profile_id) REFERENCES user_profile (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_book_user_profile_book
    FOREIGN KEY (book_id) REFERENCES book (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE book_read (
  id INT GENERATED ALWAYS AS IDENTITY CONSTRAINT pk_user_profile_book PRIMARY KEY,
  days_read INT DEFAULT 0,
  days_total INT DEFAULT 0,
  is_complete BOOLEAN DEFAULT FALSE,
  is_reading BOOLEAN DEFAULT FALSE,
  user_profile_book_id INT,
  CONSTRAINT fk_user_profile_book_book_read
    FOREIGN KEY (user_profile_book_id) REFERENCES user_profile_book (id) ON DELETE CASCADE ON UPDATE CASCADE,
);

CREATE TABLE read_entry (
  id INT GENERATED ALWAYS AS IDENTITY CONSTRAINT read_entry PRIMARY KEY,
  date_read DATE NOT NULL,
  page_completed INT NOT NULL,
  percentage_completed INT NOT NULL,
  book_read_id INT,
  CONSTRAINT fk_book_read_read_entry
    FOREIGN KEY (book_read_id) REFERENCES book_read (id) ON DELETE CASCADE ON UPDATE CASCADE
);

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

INSERT INTO user_profile (username, first_name, last_name, email) VALUES ('orenjiku', 'william', 'chang', 'wdchang86@gmail.com');
INSERT INTO book (title, title_sort, total_pages) VALUES ('the uriel ventris chronicles: volume one', 'uriel ventris chronicles: volume one, the', 800);
INSERT INTO user_profile_book (is_complete, book_id, user_profile_id) VALUES (true, SELECT id FROM book WHERE title='the uriel ventris chronicles: volume one', SELECT id FROM user_profile WHERE username='orenjiku');