--EXPLAIN ANALYZE

/* -------------------------------------------------- getBooks -------------------------------------------------- */
-- Variables: br.is_reading IS TRUE, br.is_finished IS FALSE, rb.reader_id = 1
SELECT json_agg(row_to_json(books_agg)) AS books
FROM   (
                  SELECT     b.id AS b_id,
                             b.title,
                             (
                                        SELECT     array_agg(full_name) AS author
                                        FROM       author               AS a
                                        INNER JOIN book_author          AS ba
                                        ON         a.id = ba.author_id
                                        WHERE      ba.book_id = b.id
                                        GROUP BY   b.id ),
                             b.total_pages,
                             b.blurb,
                             b.picture_link,
                             (
                                    SELECT json_agg(row_to_json(book_read_agg)) AS book_read
                                    FROM   (
                                                    SELECT   br.id AS br_id,
                                                             br.days_read,
                                                             br.days_total,
                                                             (
                                                                    SELECT json_agg(row_to_json(read_entry_agg)) AS read_entry
                                                                    FROM   (
                                                                                    SELECT   re.id AS re_id,
                                                                                             re.date_read,
                                                                                             re.current_page,
                                                                                             re.current_percent
                                                                                    FROM     read_entry AS re
                                                                                    WHERE    re.book_read_id = br.id
                                                                                    ORDER BY re.date_read DESC, re. current_page DESC ) AS read_entry_agg)
                                                    WHERE    rb.book_id = b.id
                                                    ORDER BY br.id DESC ) AS book_read_agg)
                  FROM       book_read   AS br
                  INNER JOIN reader_book AS rb
                  ON         br.reader_book_id = rb.id
                  INNER JOIN book AS b
                  ON         rb.book_id = b.id
                  WHERE      br.is_reading IS TRUE
                  AND        br.is_finished IS FALSE
                  AND        rb.reader_id = 1
                  ORDER BY   b.title_sort) AS books_agg;


/* -------------------------------------------------- getDailyReadsBooks -------------------------------------------------- */
-- Variables: outer_rb.reader_id = 1
SELECT     outer_re.date_read,
           sum(outer_re.pages_read)::INT AS total_pages_read,
           (
                  SELECT json_agg(row_to_json(breakdown_agg)) AS book_pages_breakdown
                  FROM   (
                                    SELECT     inner_b.title            AS book_title,
                                               sum(inner_re.pages_read)::INT AS pages_read
                                    FROM       read_entry               AS inner_re
                                    INNER JOIN book_read                AS inner_br
                                    ON         inner_re.book_read_id = inner_br.id
                                    INNER JOIN reader_book AS inner_rb
                                    ON         inner_br.reader_book_id = inner_rb.id
                                    INNER JOIN book AS inner_b
                                    ON         inner_rb.book_id = inner_b.id
                                    WHERE      inner_re.date_read = outer_re.date_read
                                    AND        inner_re.pages_read > 0
                                    GROUP BY   inner_b.title) AS breakdown_agg)
FROM       read_entry AS outer_re
INNER JOIN book_read  AS outer_br
ON         outer_re.book_read_id = outer_br.id
INNER JOIN reader_book AS outer_rb
ON         outer_br.reader_book_id = outer_rb.id
INNER JOIN book AS outer_b
ON         outer_rb.book_id = outer_b.id
WHERE      outer_rb.reader_id = 1
GROUP BY   outer_re.date_read
ORDER BY   outer_re.date_read DESC;


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