/* --------------------------------------------- CLEAR EXISTING TABLES --------------------------------------------- */
TRUNCATE TABLE reader, book, reader_book, read_instance, read_entry, book_author, author CASCADE;


/* --------------------------------------------- HELPER FUNCTIONS --------------------------------------------- */
-- FUNCTION get_reader_id
CREATE OR REPLACE FUNCTION get_reader_id(arg_username VARCHAR)
RETURNS INT AS $$
BEGIN
  RETURN (SELECT reader.id FROM reader WHERE reader.username=$1);
END;
$$ LANGUAGE plpgsql;

-- FUNCTION get_book_id
CREATE OR REPLACE FUNCTION get_book_id(arg_book_title VARCHAR)
RETURNS INT AS $$
BEGIN
  RETURN (SELECT id FROM book WHERE title=$1);
END;
$$ LANGUAGE plpgsql;

-- FUNCTION get_author_id
CREATE OR REPLACE FUNCTION get_author_id(arg_author_full_name VARCHAR)
RETURNS INT AS $$
BEGIN
  RETURN (SELECT a.id FROM author AS a WHERE a.full_name=$1);
END;
$$ LANGUAGE plpgsql;

-- FUNCTION get_reader_book_id (JOIN table)
CREATE OR REPLACE FUNCTION get_reader_book_id(arg_username VARCHAR, arg_book_title VARCHAR)
RETURNS INT AS $$
BEGIN
  RETURN (
    SELECT r.id FROM reader_book AS r
    WHERE r.reader_id=get_reader_id($1)
    AND r.book_id=get_book_id($2)
  );
END;
$$ LANGUAGE plpgsql;

-- FUNCTION get_read_instance_id
CREATE OR REPLACE FUNCTION get_read_instance_id(arg_username VARCHAR, arg_book_title VARCHAR)
RETURNS INT AS $$
BEGIN
  RETURN (
    SELECT ri.id FROM read_instance AS ri
    WHERE ri.reader_book_id=get_reader_book_id($1, $2)
  );
END;
$$ LANGUAGE plpgsql;

/* --------------------------------------------- INSERT reader --------------------------------------------- */
-- FUNCTION insert_reader
CREATE OR REPLACE FUNCTION insert_reader(arg_username VARCHAR, arg_user_password VARCHAR, arg_user_token VARCHAR, arg_first_name VARCHAR, arg_middle_name VARCHAR, arg_last_name VARCHAR, email VARCHAR)
RETURNS VOID AS $$
BEGIN
  INSERT INTO reader (username, user_password, user_token, first_name, middle_name, last_name, email)
  VALUES ($1, $2, $3, $4, $5, $6, $7);
END;
$$ LANGUAGE plpgsql;

/* --------------------------------------------- INSERT book --------------------------------------------- */
-- FUNCTION insert_book
CREATE OR REPLACE FUNCTION insert_book(
  arg_title VARCHAR,
  arg_title_sort VARCHAR,
  arg_published_date DATE,
  arg_edition_date DATE,
  arg_book_format VARCHAR,
  arg_total_pages INT,
  arg_blurb TEXT,
  arg_book_cover_url VARCHAR
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO book (title, title_sort, published_date, edition_date, book_format, total_pages, blurb, book_cover_url)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
END;
$$ LANGUAGE plpgsql;

/* --------------------------------------------------- INSERT reader_book --------------------------------------------------- */
-- FUNCTION insert_reader_book
CREATE OR REPLACE FUNCTION insert_reader_book(arg_username VARCHAR, arg_book_title VARCHAR)
RETURNS VOID AS $$
DECLARE
  var_reader_id INT = get_reader_id($1);
  var_book_id INT = get_book_id($2);
BEGIN
  INSERT INTO reader_book (reader_id, book_id)
  VALUES (var_reader_id, var_book_id);
END;
$$ LANGUAGE plpgsql;

/* --------------------------------------------- INSERT read_instance --------------------------------------------- */
-- FUNCTION insert_read_instance
CREATE OR REPLACE FUNCTION insert_read_instance(arg_username VARCHAR, arg_book_title VARCHAR)
RETURNS VOID AS $$
DECLARE
    var_reader_book_id INT = get_reader_book_id($1, $2);
BEGIN
    INSERT INTO read_instance (reader_book_id)
    VALUES (var_reader_book_id);
END;
$$ LANGUAGE plpgsql;

/* --------------------------------------------- INSERT read_entry --------------------------------------------- */
--FUNCTION insert_read_entry
CREATE OR REPLACE FUNCTION insert_read_entry(arg_username VARCHAR, arg_book_title VARCHAR, arg_date_read TIMESTAMP, arg_current_page INT, arg_total_pages INT)
RETURNS VOID AS $$
DECLARE
    var_read_instance_id INT = get_read_instance_id($1, $2);
BEGIN
    WITH prev_read_entry AS (
        SELECT COALESCE(
              (SELECT     current_page
              FROM        read_entry AS re
              INNER JOIN  read_instance AS ri
              ON          re.read_instance_id=var_read_instance_id
              WHERE       re.date_read < arg_date_read
              AND         ri.id = var_read_instance_id
              ORDER BY    re.date_read DESC
              LIMIT 1
        ), 0) AS current_page)
    INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id)
        (SELECT     arg_date_read,
                    arg_current_page - pre.current_page,
                    arg_current_page,
                    TRUNC(arg_current_page::DECIMAL / arg_total_pages * 100, 2),
                    var_read_instance_id
        FROM        prev_read_entry AS pre);
END;
$$ LANGUAGE plpgsql;

/* --------------------------------------------- INSERT author --------------------------------------------- */
CREATE OR REPLACE FUNCTION insert_author(arg_book_title VARCHAR, arg_full_name VARCHAR)
RETURNS VOID AS $$
DECLARE
    var_book_id INT = get_book_id($1);
    var_author_id INT;
    var_first_name VARCHAR;
    var_middle_name VARCHAR;
    var_last_name VARCHAR;
BEGIN
    SELECT id INTO var_author_id FROM author WHERE author.full_name=arg_full_name;
    IF NOT FOUND THEN
        var_first_name = (regexp_matches(arg_full_name, '^([^\s]+)'))[1];
        var_middle_name = (regexp_matches(arg_full_name, '^[^\s]+\s(.+)\s[^\s]+$'))[1];
        IF var_middle_name IS NULL THEN
            var_last_name = (regexp_matches(arg_full_name, '\s(.+)$'))[1];
        ELSE
            var_last_name = (regexp_matches(arg_full_name, '^[^\s]+\s.+\s(.+)$'))[1];
        END IF;
        INSERT INTO author (full_name, first_name, middle_name, last_name) VALUES (arg_full_name, var_first_name, var_middle_name, var_last_name) RETURNING id INTO var_author_id;
    END IF;
    INSERT INTO book_author (book_id, author_id) VALUES (var_book_id, var_author_id);
END;
$$ LANGUAGE plpgsql;

/* --------------------------------------------- UPDATE read_instance --------------------------------------------- */
-- FUNCTION UPDATE read_instance
CREATE OR REPLACE FUNCTION update_read_instance(
    arg_username VARCHAR,
    arg_book_title VARCHAR,
    arg_is_reading BOOLEAN,
    arg_is_finished BOOLEAN,
    arg_is_dnf BOOLEAN
)
RETURNS VOID AS $$
DECLARE
    var_reader_id INT = get_reader_id($1);
    var_book_id INT = get_book_id($2);
    var_read_instance_id INT = get_read_instance_id($1, $2);
BEGIN
    UPDATE    read_instance
    SET       days_read =       t2.days_read,
              days_total =      t2.days_total,
              pages_read =      t2.pages_read,
              max_daily_read =  (SELECT   COALESCE(MAX(daily_read.daily_pages_read), 0)
                                FROM      (SELECT   SUM(pages_read) AS daily_pages_read
                                          FROM      read_entry AS re
                                          WHERE     re.read_instance_id = var_read_instance_id
                                          GROUP     BY Date(re.date_read)) AS daily_read),
              is_reading =      arg_is_reading,
              is_finished =     arg_is_finished,
              is_dnf =          arg_is_dnf
    FROM      (SELECT     COUNT(DISTINCT Date(re.date_read)) AS days_read,
                          COALESCE(MAX(Date(re.date_read)) - MIN(Date(re.date_read)) + 1, 0) AS days_total,
                          COALESCE(SUM(re.pages_read), 0) AS pages_read
              FROM        read_entry AS re
              WHERE       re.read_instance_id = var_read_instance_id) AS t2
    WHERE     read_instance.id = var_read_instance_id;
END;
$$ LANGUAGE plpgsql;

/* --------------------------------------------- UPDATE reader_book  --------------------------------------------- */
-- FUNCTION UPDATE reader_book
CREATE OR REPLACE FUNCTION update_reader_book(arg_username VARCHAR, arg_book_title VARCHAR)
RETURNS VOID AS $$
DECLARE
    var_reader_id INT = get_reader_id($1);
    var_book_id INT = get_book_id($2);
    var_reader_book_id INT = get_reader_book_id($1, $2);
BEGIN
    UPDATE  reader_book
    SET     is_any_reading =     t2.is_any_reading,
            is_any_finished =    t2.is_any_finished,
            is_all_dnf =         t2.is_any_dnf
    FROM (SELECT  bool_or(ri.is_reading) AS is_any_reading,
                  bool_or(ri.is_finished) AS is_any_finished,
                  bool_and(ri.is_dnf) AS is_any_dnf
                  FROM read_instance AS ri
                  INNER JOIN reader_book AS rb
                  ON ri.reader_book_id = rb.id
                  AND rb.id = var_reader_book_id) AS t2
    WHERE reader_book.id = var_reader_book_id;
END;
$$ LANGUAGE plpgsql;