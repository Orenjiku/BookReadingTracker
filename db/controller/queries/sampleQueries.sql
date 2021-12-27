--EXPLAIN ANALYZE

/* -------------------------------------------------- getBooks -------------------------------------------------- */
-- Example currently_reading: reader.id = 1, reader_book.is_any_reading = TRUE
        SELECT
            COALESCE(json_agg(row_to_json(books_agg)), '[]'::json) AS books
        FROM
            (
                SELECT
                    b.id AS b_id,
                    b.title,
                    (
                        SELECT
                            COALESCE(array_agg(full_name ORDER BY a.last_name ASC), ARRAY[]::TEXT[]) AS author
                        FROM
                            author AS a
                            INNER JOIN book_author AS ba ON a.id = ba.author_id
                        WHERE
                            ba.book_id = b.id
                    ),
                    b.book_format,
                    b.total_pages,
                    b.published_date,
                    b.edition_date,
                    b.book_cover_url,
                    b.blurb,
                    (
                        SELECT
                            row_to_json(reader_book_agg) AS reader_book
                        FROM
                            (
                                SELECT
                                    rb.id AS rb_id,
                                    rb.is_any_reading,
                                    rb.is_any_finished,
                                    rb.is_all_dnf,
                                    (
                                        SELECT
                                            COALESCE(json_agg(row_to_json(read_instance_agg)), '[]'::json) AS read_instance
                                        FROM
                                            (
                                                SELECT
                                                    ri.id AS ri_id,
                                                    ri.days_read,
                                                    ri.days_total,
                                                    ri.pages_read,
                                                    ri.max_daily_read,
                                                    ri.is_reading,
                                                    ri.is_finished,
                                                    ri.is_dnf,
                                                    ri.reader_book_id,
                                                    (
                                                        SELECT
                                                            COALESCE(json_agg(row_to_json(read_entry_agg)), '[]'::json) AS read_entry
                                                        FROM
                                                            (
                                                                SELECT
                                                                    re.id AS re_id,
                                                                    re.date_read,
                                                                    re.pages_read,
                                                                    re.current_page,
                                                                    re.current_percent
                                                                FROM
                                                                    read_entry AS re
                                                                WHERE
                                                                    re.read_instance_id = 24
                                                                ORDER BY
                                                                    re.date_read DESC,
                                                                    re.current_page DESC
                                                            ) AS read_entry_agg
                                                    )
                                                FROM
                                                    read_instance AS ri
                                                WHERE
                                                    ri.reader_book_id = rb.id
                                                ORDER BY
                                                    ri.id DESC
                                            ) AS read_instance_agg
                                    )
                                FROM
                                    reader_book AS rb
                                WHERE
                                    rb.reader_id = r.id
                                    AND rb.book_id = b.id
                            ) AS reader_book_agg
                    )
                FROM
                    reader AS r
                    INNER JOIN reader_book AS rb ON r.id = rb.reader_id
                    INNER JOIN book AS b ON rb.book_id = b.id
                WHERE
              r.id = 1
              AND rb.is_any_reading = TRUE
       ORDER BY
              b.title_sort
       ) AS books_agg;


/* -------------------------------------------------- getReaderStats -------------------------------------------------- */
-- sum_pages read
SELECT SUM(pages_read) AS total_pages_read
FROM read_entry AS re
INNER JOIN book_read AS br
ON re.book_read_id = br.id
INNER JOIN reader_book AS rb
ON br.reader_book_id = rb.id
WHERE rb.reader_id = 1 AND re.date_read BETWEEN '2021-01-01' AND '2021-12-31';


SELECT MAX(re.pages_read)
FROM reader_book AS rb
INNER JOIN book_read AS br
ON br.reader_book_id = rb.id
INNER JOIN read_entry AS re
ON re.book_read_id = br.id





WITH t as (
       SELECT distinct(re.date_read::date) as date_read
       FROM read_entry AS re
       INNER JOIN book_read AS br
       ON re.book_read_id = br.id
       INNER JOIN reader_book AS rb
       ON br.reader_book_id = rb.id
       WHERE rb.reader_id = 1
)
SELECT count(*)
FROM t
WHERE t.date_read > (
       SELECT d.d
       FROM generate_series('2010-01-01'::date, CURRENT_DATE - 1, '1 day') AS d
       LEFT OUTER JOIN t ON t.date_read = d.d::date
       WHERE t.date_read IS NULL
       ORDER BY d.d DESC
       Limit 1
);


-- UPSERT author, INSERT book_author book_id and author_id
WITH val AS (SELECT id FROM author WHERE full_name='Anthony Reynolds')
, ins (id) AS (
       INSERT INTO author (full_name, first_name, middle_name, last_name)
       VALUES ('Anthony Reynolds', 'Anthony', '', 'Reynolds')
       ON CONFLICT (full_name) DO NOTHING
       RETURNING id
       )
INSERT INTO book_author (book_id, author_id) VALUES (19, (SELECT COALESCE(val.id, ins.id) FROM val FULL JOIN ins ON val.id=ins.id));

-- GET book titles based on author full_name
SELECT b.title FROM book As b INNER JOIN book_author AS ba ON ba.book_id=b.id AND ba.author_id=(SELECT id FROM author WHERE full_name='Dan Abnett');

-- GET all read_entry columns from reader_book, i.e. read_enties from every read_instance based on reader_book id.
SELECT * FROM read_entry AS re INNER JOIN read_instance AS ri ON ri.reader_book_id=19 AND re.read_instance_id=ri.id;

-- UPDATE total_pages
UPDATE book AS b SET total_pages=400 WHERE b.id=19;

--UPDATE all read_entry current_percent from reader_book.
UPDATE read_entry AS re SET current_percent=TRUNC(current_page::DECIMAL/400*100, 2) FROM read_instance AS ri WHERE re.read_instance_id=ri.id AND ri.reader_book_id=19;



-- ADD read_entry
INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id)
(SELECT '2021-09-11', 233 - re.current_page, 233, 233 / 828 * 100, 19 FROM read_entry AS re INNER JOIN read_instance AS ri ON ri.id=19 AND re.read_instance_id=ri.id WHERE re.date_read < '2021-09-11' ORDER BY re.date_read DESC LIMIT 1);

-- UPDATE NEXT row
UPDATE read_entry AS re SET pages_read=(re.pages_read - 74) WHERE re.id=(SELECT re.id FROM read_entry AS re INNER JOIN read_instance AS ri ON ri.id=19 AND re.read_instance_id=ri.id WHERE re.date_read > '2021-09-19' ORDER BY re.date_read ASC LIMIT 1);

-- -- SELECT NEXT row based on closest DATE
-- SELECT * FROM read_entry AS re INNER JOIN read_instance AS ri ON ri.id=19 AND re.read_instance_id=ri.id WHERE re.date_read > '2021-09-11' ORDER BY re.date_read ASC LIMIT 1;

-- -- SELECT PREV row based on closest DATE
-- SELECT * FROM read_entry AS re INNER JOIN read_instance AS ri ON ri.id=19 AND re.read_instance_id=ri.id WHERE re.date_read < '2021-09-11' ORDER BY re.date_read DESC LIMIT 1;

INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id)
(SELECT TO_TIMESTAMP('2021-11-02 13:49:33', 'YYYY-MM-DD HH24:MI:SS'), 900 - re.current_page, 900, 900 / 828 * 100, 19 FROM read_entry AS re INNER JOIN read_instance AS ri ON ri.id=19 AND re.read_instance_id=ri.id WHERE re.date_read < TO_TIMESTAMP('2021-11-02 13:49:33', 'YYYY-MM-DD HH24:MI:SS') ORDER BY re.date_read DESC LIMIT 1);

SELECT MAX(daily_read.daily_pages_read)
FROM (SELECT SUM(pages_read) AS daily_pages_read
       FROM read_entry AS re
       WHERE re.read_instance_id = 19
       GROUP BY DATE(re.date_read))
AS daily_read;

UPDATE read_instance
SET days_read =       (SELECT COUNT(DISTINCT Date(re.date_read)) AS days_read
                     FROM read_instance AS ri
                     INNER JOIN read_entry AS re
                     ON re.read_instance_id = 19,
       days_total =      (SELECT (MAX(Date(re.date_read)) - MIN(Date(re.date_read)) + 1) AS days_total
                     FROM read_entry AS re
                     WHERE re.read_instance_id = 19,
       pages_read =      (SELECT SUM(re.pages_read)
                     FROM read_entry AS re
                     WHERE re.read_instance_id = 19,
       max_daily_read =  (SELECT MAX(daily_read.daily_pages_read)
                     FROM (SELECT SUM(pages_read) AS daily_pages_read
                            FROM read_entry AS re
                            WHERE re.read_instance_id = 19
                            GROUP BY Date(re.date_read))
                     AS daily_read),
       is_reading = ${isReading},
       is_finished = ${isFinished},
WHERE read_instance.id=19;

UPDATE read_instance
SET days_read =       (SELECT COUNT(DISTINCT Date(re.date_read)) AS days_read
                     FROM read_instance AS ri
                     INNER JOIN read_entry AS re
                     ON re.read_instance_id = 19,
       days_total =      (SELECT (MAX(Date(re.date_read)) - MIN(Date(re.date_read)) + 1) AS days_total
                     FROM read_entry AS re
                     WHERE re.read_instance_id = 19,
       pages_read =      (SELECT SUM(re.pages_read)
                     FROM read_entry AS re
                     WHERE re.read_instance_id = 19,
       max_daily_read =  (SELECT MAX(daily_read.daily_pages_read)
                     FROM (SELECT SUM(pages_read) AS daily_pages_read
                            FROM read_entry AS re
                            WHERE re.read_instance_id = 19
                            GROUP BY Date(re.date_read))
                     AS daily_read),
       is_reading = ${isReading},
       is_finished = ${isFinished},
WHERE read_instance.id=19;


-- Update read_instance when totalPages updated
UPDATE read_instance AS ri
       SET is_reading = (SELECT
                     (CASE WHEN pages_read < 828 THEN TRUE ELSE FALSE END) AS is_reading
       ),
       is_finished = (SELECT
                     (CASE WHEN pages_read >= 828 THEN TRUE ELSE FALSE END) AS is_reading
       )
WHERE ri.reader_book_id=(SELECT rb.id FROM reader_book AS rb WHERE rb.reader_id=1 AND rb.book_id=19);
-- Check if update worked.
WITH cte_read_instance AS (
       SELECT ri.pages_read, ri.id
       FROM read_instance AS ri INNER JOIN reader_book AS rb
       ON ri.reader_book_id=rb.id AND rb.reader_id=1 AND rb.book_id=19
)
SELECT
ri.id,
ri.pages_read,
ri.is_reading,
ri.is_finished
FROM read_instance AS ri INNER JOIN cte_read_instance
ON ri.id = cte_read_instance.id;

-- Update reader_book when totalPages updated
UPDATE reader_book AS rb
SET is_any_reading =    (SELECT bool_or(ri.is_reading)
                            FROM read_instance AS ri
                            WHERE ri.reader_book_id = rb.id),
       is_any_finished =   (SELECT bool_or(ri.is_finished)
                            FROM read_instance aS ri
                            WHERE ri.reader_book_id = rb.id),
       is_all_dnf =        (SELECT bool_and(ri.is_dnf)
                            FROM read_instance AS ri
                            WHERE ri.reader_book_id = rb.id)
WHERE rb.id = (SELECT id
       FROM reader_book AS rb
       WHERE rb.reader_id=1 AND rb.book_id=19);
-- Check update worked
SELECT * FROM reader_book AS rb WHERE rb.id=19;


-- Update next read_entry pages_read after deleting an entry.
readInstanceId: number, readEntryId: number
WITH next_re AS (
       SELECT      re.id, re.current_page, re.read_instance_id
       FROM        read_entry AS re
       INNER JOIN  read_instance AS ri
       ON          re.read_instance_id=24
       AND         re.date_read > (SELECT date_read FROM read_entry AS re WHERE re.id=210)
       ORDER BY    date_read ASC
       LIMIT 1),
prev_re AS (
       SELECT      re.id, re.current_page, re.read_instance_id
       FROM        read_entry AS re
       INNER JOIN  read_instance AS ri
       ON          re.read_instance_id=24
       AND         re.date_read < (SELECT date_read FROM read_entry AS re WHERE re.id=210)
       ORDER BY    date_read DESC
       LIMIT 1)
UPDATE  read_entry
SET     pages_read = next_re.current_page - prev_re.current_page
FROM          next_re
INNER JOIN    prev_re
ON            next_re.read_instance_id = prev_re.read_instance_id
WHERE         read_entry.id = next_re.id;
-- Check if update worked.
SELECT * FROM read_entry AS re WHERE re.read_instance_id=24 ORDER BY date_read;
--Alternative UPDATE, but joining tables with comma considered deprecated.
UPDATE read_entry
SET pages_read = next_re.current_page - prev_re.current_page
FROM next_re, prev_re
WHERE read_entry.id = next_re.id;


-- Update is_reading and is_finished when totalPages not sent from frontend.
WITH cte_book AS (
       SELECT b.id, b.total_pages
       FROM book AS b
       INNER JOIN reader_book AS rb ON b.id=rb.book_id
       INNER JOIN read_instance AS ri ON rb.id=ri.reader_book_id
       WHERE ri.id=24)
UPDATE read_instance AS ri
SET    is_reading = (SELECT (CASE WHEN ri.pages_read < cte_book.total_pages THEN TRUE ELSE FALSE END) AS is_reading),
       is_finished = (SELECT (CASE WHEN ri.pages_read >= cte_book.total_pages THEN TRUE ELSE FALSE END) AS is_finished)
FROM cte_book
WHERE ri.reader_book_id=(
       SELECT reader_book_id
       FROM read_instance AS ri
       WHERE ri.id=24);
-- Check if update worked
SELECT * FROM read_instance WHERE read_instance.reader_book_id = (SELECT reader_book_id FROM read_instance AS ri WHERE ri.id=24);

--Alternative cte_book format above, but is considered deprecated due to usage of commas
WITH cte_book AS (
       SELECT b.id, b.total_pages
       FROM book AS b, reader_book AS rb, read_instance AS ri
       WHERE ri.id=24 AND ri.reader_book_id=rb.id AND rb.book_id=b.id)


CREATE OR REPLACE FUNCTION postBook(arg_reader_id INT, arg_book_title VARCHAR)
RETURNS INT AS $$
DECLARE
    var_book_id INT = (SELECT id FROM book WHERE book.title=arg_book_title);
    var_reader_book_id INT;
BEGIN
    RAISE NOTICE 'book_id: %', var_book_id;
    IF var_book_id IS NOT NULL THEN
        SELECT id INTO var_reader_book_id FROM reader_book AS rb WHERE rb.reader_id=1 AND rb.book_id=var_book_id;
        RAISE NOTICE 'reader_book_id: %', var_reader_book_id;
        IF var_reader_book_id IS NOT NULL THEN
            RETURN var_reader_book_id;
        ELSE
            INSERT INTO reader_book (reader_id, book_id) VALUES (arg_reader_id, var_book_id) RETURNING id INTO var_reader_book_id;
            INSERT INTO read_instance (reader_book_id) VALUES (var_reader_book_id);
        END IF;
    ELSE
        RAISE NOTICE 'bleh';
    END IF;
    RETURN var_book_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION getReaderBookId(arg_reader_id INT, arg_book_title VARCHAR)
RETURNS INT AS $$
DECLARE
    var_book_id INT = (SELECT id FROM book WHERE book.title=arg_book_title);
    var_reader_book_id INT;
BEGIN
    IF var_book_id IS NULL THEN
        INSERT INTO book (title, title_sort) VALUES (arg_book_title, arg_book_title) RETURNING id INTO var_book_id;
    END IF;

    SELECT id INTO var_reader_book_id FROM reader_book AS rb WHERE rb.reader_id=arg_reader_id AND rb.book_id=var_book_id;

    IF var_reader_book_id IS NULL THEN
        INSERT INTO reader_book (reader_id, book_id) VALUES (arg_reader_id, var_book_id) RETURNING id INTO var_reader_book_id;
        INSERT INTO read_instance (reader_book_id) VALUES (var_reader_book_id);
        RETURN 1;
    ELSE
        RETURN -1;
    END IF;

END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION getReaderBookId(arg_reader_id INT, arg_book_title VARCHAR)
RETURNS INT AS $$
DECLARE
    var_book_id INT = (SELECT id FROM book WHERE book.title=arg_book_title);
    var_reader_book_id INT = (SELECT id FROM reader_book AS rb WHERE rb.reader_id=arg_reader_id AND rb.book_id=var_book_id);
BEGIN
    IF var_book_id IS NULL THEN
        INSERT INTO book (title, title_sort) VALUES (arg_book_title, arg_book_title) RETURNING id INTO var_book_id;
    END IF;

    IF var_reader_book_id IS NULL THEN
        INSERT INTO reader_book (reader_id, book_id) VALUES (arg_reader_id, var_book_id) RETURNING id INTO var_reader_book_id;
        INSERT INTO read_instance (reader_book_id) VALUES (var_reader_book_id);
        RETURN 1;
    ELSE
        RETURN -1;
    END IF;

END;
$$ LANGUAGE plpgsql;


CREATE PROCEDURE add_reader_book(arg_reader_id INT, arg_book_title VARCHAR)
LANGUAGE plpgsql AS $$
DECLARE
    var_book_id INT = (SELECT id FROM book WHERE book.title=arg_book_title);
    var_reader_book_id INT = (SELECT id FROM reader_book AS rb WHERE rb.reader_id=arg_reader_id AND rb.book_id=var_book_id);
BEGIN
    IF var_book_id IS NULL THEN
        INSERT INTO book (title, title_sort) VALUES (arg_book_title, arg_book_title) RETURNING id INTO var_book_id;
    END IF;

    IF var_reader_book_id IS NULL THEN
        INSERT INTO reader_book (reader_id, book_id, is_any_reading) VALUES (arg_reader_id, var_book_id, TRUE ) RETURNING id INTO var_reader_book_id;
        INSERT INTO read_instance (reader_book_id, is_reading) VALUES (var_reader_book_id, TRUE);
    END IF;
END;
$$;

/* if var_reader_book_id is NULL, return book exists in collection. else success*/

SELECT getReaderBookId(1, 'hello');

CALL getReaderBookId(1, 'hello');


CREATE OR REPLACE PROCEDURE post_author(author_array TEXT[])
LANGUAGE plpgsql AS $$
DECLARE
    author VARCHAR;
BEGIN
    FOREACH author IN ARRAY author_array
    LOOP
        RAISE NOTICE 'firstname, %', regexp_matches(author, '^([^\s]+)');
        IF regexp_matches(author, '^\w+\s.+\s(\w+)$') IS NOT NULL THEN
            RAISE NOTICE 'middlename, %', regexp_matches(author, '^\w+\s(.*)\s\w+$');
            RAISE NOTICE 'lastname, %', regexp_matches(author, '\s(\w+)$');
        ELSE
            RAISE NOTICE 'lastname, %', regexp_matches(author, '\s(\w+)$');
        END IF;
    END LOOP;
END;
$$;

CALL post_author(ARRAY['Bill Nye', 'Will A B C DEFG', 'r2-d2', 'rb-16 hello']);


CREATE OR REPLACE PROCEDURE post_author(author_array TEXT[])
LANGUAGE plpgsql AS $$
DECLARE
    var_author VARCHAR;
    var_author_id INT;
    var_first_name VARCHAR = '';
    var_middle_name VARCHAR = '';
    var_last_name VARCHAR = '';
BEGIN
    FOREACH var_author IN ARRAY author_array
    LOOP
        SELECT id INTO var_author_id FROM author AS a WHERE a.full_name=var_author;
        IF var_author_id IS NULL THEN
            var_first_name = regexp_matches(author, '^([^\s]+)');
            var_last_name = regexp_matches(author, '^\w+\s.+\s(\w+)$');
            IF var_last_name IS NOT NULL THEN
                var_middle_name = regexp_matches(author, '^\w+\s(.*)\s\w+$');
            ELSE
                var_last_name = regexp_matches(author, '\s(\w+)$');
            END IF;
            INSERT INTO author (full_name, first_name, middle_name, last_name) VALUES (var_author, var_first_name, var_middle_name, var_last_name) RETURNING id INTO var_author_id;
        END IF;
        INSERT INTO book_author (book_id, author_id) VALUES (${bookId}, var_author_id);
        var_first_name = '';
        var_middle_name = '';
        var_last_name = '';
        var_author_id = NULL;
    END LOOP;
END;
$$;

CREATE OR REPLACE PROCEDURE post_author(author_array TEXT[])
LANGUAGE plpgsql AS $$
DECLARE
    var_author VARCHAR;
    var_author_id INT;
    var_first_name VARCHAR = '';
    var_middle_name VARCHAR = '';
    var_last_name VARCHAR = '';
BEGIN
    FOREACH var_author IN ARRAY author_array
    LOOP
        SELECT id INTO var_author_id FROM author AS a WHERE a.full_name=var_author;
        IF NOT FOUND THEN
            var_first_name = (regexp_matches(var_author, '^([^\s]+)'))[1];
            var_last_name = (regexp_matches(var_author, '^\w+\s.+\s(\w+)$'))[1];
            RAISE NOTICE 'outer first, %', var_first_name;
            RAISE NOTICE 'outer last, %', var_last_name;
            IF var_last_name IS NULL THEN
                var_last_name = (regexp_matches(var_author, '\s(\w+)$'))[1];
                RAISE NOTICE 'inner last, %', var_last_name;
            ELSE
                var_middle_name = (regexp_matches(var_author, '^\w+\s(.*)\s\w+$'))[1];
            END IF;
            INSERT INTO author (full_name, first_name, middle_name, last_name) VALUES (var_author, var_first_name, var_middle_name, var_last_name) RETURNING id INTO var_author_id;
        END IF;
        INSERT INTO book_author (book_id, author_id) VALUES (31, var_author_id);
        var_first_name = '';
        var_middle_name = '';
        var_last_name = '';
    END LOOP;
END;
$$;

CALL post_author(ARRAY['Bill Nye', 'Will A B C DEFG', 'r2-d2', 'rb-16 hello']);