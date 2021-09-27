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
                     array_agg(full_name ORDER BY a.last_name ASC) AS author
              FROM
                     author AS a
                     INNER JOIN book_author AS ba ON a.id = ba.author_id
              WHERE
                     ba.book_id = b.id
              GROUP BY
                     b.id, a.last_name
              ORDER BY
                     a.last_name ASC
              ),
              b.published_date,
              b.published_date_edition,
              b.book_format,
              b.total_pages,
              b.blurb,
              b.picture_link,
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
                                                 ri.id ASC
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


