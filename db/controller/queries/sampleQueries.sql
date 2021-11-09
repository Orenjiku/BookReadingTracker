--EXPLAIN ANALYZE

/* -------------------------------------------------- getBooks -------------------------------------------------- */
-- Example currently_reading: reader.id = 1, reader_book.is_any_reading = TRUE
SELECT
       json_agg(row_to_json(books_agg)) AS books
FROM
       (
       SELECT
              b.id AS b_id,
              b.title,
              (
                        SELECT
                            COALESCE(array_agg(full_name ORDER BY a.last_name ASC), '{[hello]}') AS author
                        FROM
                            author AS a
                            INNER JOIN book_author AS ba ON a.id = ba.author_id
                        WHERE
                            ba.book_id = b.id
                        GROUP BY
                            b.id
              ),
              b.book_format,
              b.total_pages,
              b.published_date,
              b.edition_date,
              b.picture_url,
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
                                   json_agg(row_to_json(read_instance_agg)) AS read_instance
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
                                          (
                                                 SELECT
                                                 json_agg(row_to_json(read_entry_agg)) AS read_entry
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
                                                               re.read_instance_id = ri.id
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


UPDATE  read_instance
SET     days_read =       (SELECT   COUNT(DISTINCT Date(re.date_read)) AS days_read
                            FROM      read_entry AS re
                            WHERE     re.read_instance_id = 24),
       days_total =      (SELECT   (MAX(Date(re.date_read)) - MIN(Date(re.date_read)) + 1) AS days_total
                            FROM      read_entry AS re
                            WHERE     re.read_instance_id = 24),
       pages_read =      (SELECT   SUM(re.pages_read)
                            FROM      read_entry AS re
                            WHERE     re.read_instance_id = 24),
       max_daily_read =  (SELECT   MAX(daily_read.daily_pages_read)
                            FROM      (SELECT   SUM(pages_read) AS daily_pages_read
                                   FROM      read_entry AS re
                                   WHERE     re.read_instance_id = 24
                                   GROUP BY  Date(re.date_read))
                                   AS        daily_read)
WHERE   read_instance.id=24;

DELETE FROM       author
WHERE NOT EXISTS  (SELECT author_id FROM book_author AS ba WHERE ba.author_id = (SELECT id FROM author AS a WHERE a.full_name='asd asd'));


DELETE FROM author
WHERE author.id = 54
AND author.id NOT IN (SELECT ba.author_id FROM book_author AS ba);

WITH cte_author AS (
       SELECT  id
       FROM    author
       WHERE   author.full_name = 'Guy Haley')
DELETE FROM   book_author AS ba
USING         cte_author
WHERE         ba.book_id = 24
AND           ba.author_id = cte_author.id;


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
              re.read_instance_id = 27
       ORDER BY
              re.date_read DESC,
              re.current_page DESC
       ) AS read_entry_agg;

WITH prev_read_entry AS (
SELECT         COALESCE(current_page, 0) AS current_page
FROM           read_entry AS re
INNER JOIN     read_instance AS ri
ON             re.read_instance_id=ri.id
WHERE          re.date_read < TO_TIMESTAMP('2021-11-08', 'YYYY-MM-DD HH24:MI:SS')
AND            ri.id = 27
ORDER BY       re.date_read DESC
LIMIT 1)
INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id)
       (SELECT       TO_TIMESTAMP('2021-11-08', 'YYYY-MM-DD HH24:MI:SS'),
                     300 - pre.current_page,
                     300,
                      TRUNC(300 / 944 * 100, 2),
                      27
       FROM prev_read_entry AS pre);

--doesn't return any rows if there is no match, therefore COALESCE doesn't work.
SELECT         COALESCE(current_page, 0) AS current_page
FROM           read_entry AS re
INNER JOIN     read_instance AS ri
ON             re.read_instance_id=ri.id
WHERE          re.date_read < TO_TIMESTAMP('2021-11-08', 'YYYY-MM-DD HH24:MI:SS')
AND            ri.id = 27
ORDER BY       re.date_read DESC
LIMIT 1

--COALESCE works here
SELECT         COALESCE(MIN(current_page), 0) AS current_page
FROM           read_entry AS re
LEFT JOIN      read_instance AS ri
ON             re.read_instance_id=ri.id
WHERE          re.date_read < TO_TIMESTAMP('2021-11-08', 'YYYY-MM-DD HH24:MI:SS')
AND            ri.id = 27
ORDER BY       re.date_read DESC
LIMIT 1;


WITH cte AS (
       SELECT COUNT(id) AS count
       FROM read_instance AS ri
       WHERE ri.reader_book_id=$24
)
IF (SELECT count FROM cte) > 1 THEN
       DELETE FROM read_instance AS ri USING cte WHERE ri.id = 24
ELSE
       DELETE FROM read_entry AS re WHERE re.read_instance_id=24
END IF;