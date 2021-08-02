SELECT b.title, b.total_pages, b.blurb, br.days_read, br.days_total FROM book_read AS br INNER JOIN reader_book AS rb ON br.reader_book_id=rb.id AND br.is_reading IS TRUE INNER JOIN book AS b ON rb.book_id=b.id;

-- working
SELECT b.title, b.total_pages, br.days_read, br.days_total, row_to_json(re) FROM (SELECT * FROM read_entry) AS re INNER JOIN book_read AS br ON re.book_read_id=br.id INNER JOIN reader_book AS rb ON br.reader_book_id=rb.id AND br.is_reading IS TRUE INNER JOIN book AS b ON rb.book_id=b.id;

-- aggregate a json array of read entries based on book_read_id
SELECT json_agg(re)
FROM (SELECT date_read, page_completed, percentage_completed FROM read_entry WHERE book_read_id=11 ORDER BY date_read DESC) AS re;

SELECT
b.title,
b.total_pages,
br.days_read,
br.days_total,
(SELECT json_agg(read_entry)
  FROM (
    SELECT date_read, page_completed, percentage_completed
    FROM read_entry
    INNER JOIN book_read
    ON read_entry.book_read_id=book_read.id
    INNER JOIN reader_book
    ON reader_book.reader_id=book_read.reader_book_id AND reader_book.id=1
    ORDER BY date_read DESC
  ) AS read_entry)
FROM book_read AS br INNER JOIN reader_book AS rb ON br.reader_book_id=rb.id AND br.is_reading=TRUE INNER JOIN book AS b ON rb.book_id=b.id;

-- array of book_entry inside an array of book_reads
SELECT
  b.title,
  b.total_pages,
  br.days_read,
  br.days_total,
  (SELECT json_agg(reader_book)
    FROM (
      SELECT rb.id,
      (SELECT json_agg(read_entry)
        FROM (
          SELECT date_read, page_completed, percentage_completed
          FROM read_entry AS re
          INNER JOIN book_read AS br
            ON re.book_read_id=br.id
          INNER JOIN reader_book AS rb
            ON rb.reader_id=br.reader_book_id AND rb.id=1
          ORDER BY date_read DESC
        ) AS read_entry)
      FROM reader_book AS rb WHERE rb.book_id=b.id
    ) AS reader_book)
FROM book_read AS br INNER JOIN reader_book AS rb ON br.reader_book_id=rb.id AND br.is_reading=TRUE INNER JOIN book AS b ON rb.book_id=b.id;

-- GET read entries for is_reading books
SELECT re.date_read, re.page_completed, re.percentage_completed
  FROM read_entry AS re
    INNER JOIN book_read AS br
      ON br.id = re.book_read_id
    INNER JOIN reader_book AS rb
      ON br.reader_book_id = rb.id
    INNER JOIN book AS b
      ON b.id = rb.book_id
  WHERE rb.reader_id = 1 AND br.is_reading=TRUE
  ORDER BY re.date_read DESC;

SELECT array_to_json(array_agg(input))
FROM (
  SELECT re.date_read, re.page_completed, re.percentage_completed
    FROM read_entry AS re
      INNER JOIN book_read AS br
        ON br.id = re.book_read_id
      INNER JOIN reader_book AS rb
        ON br.reader_book_id = rb.id
      INNER JOIN book AS b
        ON b.id = rb.book_id
    WHERE rb.reader_id = 1 AND br.is_reading=TRUE
    ORDER BY re.date_read DESC
) input

SELECT json_agg(input)
FROM (
  SELECT re.date_read, re.page_completed, re.percentage_completed
    FROM read_entry AS re
      INNER JOIN book_read AS br
        ON br.id = re.book_read_id
      INNER JOIN reader_book AS rb
        ON br.reader_book_id = rb.id
      INNER JOIN book AS b
        ON b.id = rb.book_id
    WHERE rb.reader_id = 1 AND br.is_reading=TRUE
    ORDER BY re.date_read DESC
) input


-- Returns multiple JSON objects (one for each row)
SELECT row_to_json(read_entry)
FROM (
  SELECT re.id, re.date_read, re.page_completed, re.percentage_completed
    FROM read_entry AS re
      INNER JOIN book_read AS br
        ON br.id = re.book_read_id
      INNER JOIN reader_book AS rb
        ON br.reader_book_id = rb.id
      INNER JOIN book AS b
        ON b.id = rb.book_id
    WHERE rb.reader_id = 1 AND br.is_reading=TRUE
    ORDER BY re.date_read DESC
) AS read_entry;

-- Returns a single array of JSON objects
SELECT json_agg(row_to_json(read_entry)) AS read_entry
FROM (
  SELECT re.id, re.date_read, re.page_completed, re.percentage_completed
    FROM read_entry AS re
      INNER JOIN book_read AS br
        ON br.id = re.book_read_id
      INNER JOIN reader_book AS rb
        ON br.reader_book_id = rb.id
      INNER JOIN book AS b
        ON b.id = rb.book_id
    WHERE rb.reader_id = 1 AND br.is_reading=TRUE
    ORDER BY re.date_read DESC
) AS read_entry;
-- OR
SELECT array_to_json(array_agg(row_to_json(read_entry))) AS read_entry
FROM (
  SELECT re.id, re.date_read, re.page_completed, re.percentage_completed
    FROM read_entry AS re
      INNER JOIN book_read AS br
        ON br.id = re.book_read_id
      INNER JOIN reader_book AS rb
        ON br.reader_book_id = rb.id
      INNER JOIN book AS b
        ON b.id = rb.book_id
    WHERE rb.reader_id = 1 AND br.is_reading=TRUE
    ORDER BY re.date_read DESC
) AS read_entry;

-- INNER
SELECT json_agg(row_to_json(book_read)) AS book_read
FROM (
  SELECT br.id,
  (SELECT json_agg(row_to_json(read_entry)) AS read_entry
    FROM (
      SELECT re.id, re.date_read, re.page_completed, re.percentage_completed
    ) AS read_entry)
  FROM read_entry AS re
    INNER JOIN book_read AS br
      ON br.id = re.book_read_id
    INNER JOIN reader_book AS rb
      ON br.reader_book_id = rb.id
    INNER JOIN book AS b
      ON b.id = rb.book_id
    WHERE rb.reader_id = 1 AND br.is_reading=TRUE
    ORDER BY br.id DESC, re.date_read DESC
) AS book_read;


INSERT INTO read_entry (date_read, page_completed, percentage_completed, book_read_id) VALUES ('8/1/21', 600, 75, 12);


-- BASED ON reader_id and book_id
SELECT
  b.title,
  b.total_pages,
  b.blurb,
  b.picture_link,
  (SELECT json_agg(row_to_json(book_read_agg)) AS book_read
    FROM (
      SELECT
        br.id,
        br.days_read,
        br.days_total,
        (SELECT json_agg(row_to_json(read_entry_agg)) AS read_entry
          FROM (
            SELECT re.id, re.date_read, re.page_completed, re.percentage_completed
              FROM read_entry AS re
                WHERE re.book_read_id = br.id
                ORDER BY re.date_read DESC
          ) AS read_entry_agg)
        FROM book_read AS br
        INNER JOIN reader_book AS rb
        ON br.reader_book_id = rb.id
        WHERE rb.book_id = b.id AND rb.reader_id = 1
        ORDER BY br.id DESC
    ) AS book_read_agg)
  FROM book AS b
  WHERE b.id = 11;

-- BASED ON is_reading IS TRUE
SELECT
  b.title,
  b.total_pages,
  b.blurb,
  b.picture_link,
  (SELECT json_agg(row_to_json(book_read_agg)) AS book_read
    FROM (
      SELECT
        br.id,
        br.days_read,
        br.days_total,
        (SELECT json_agg(row_to_json(read_entry_agg)) AS read_entry
          FROM (
            SELECT re.id, re.date_read, re.page_completed, re.percentage_completed
              FROM read_entry AS re
                WHERE re.book_read_id = br.id
                ORDER BY re.date_read DESC
          ) AS read_entry_agg)
        FROM book_read AS br
        INNER JOIN reader_book AS rb
        ON br.reader_book_id = rb.id
        WHERE rb.book_id = b.id AND rb.reader_id = 1 AND is_reading IS TRUE
        ORDER BY br.id DESC
    ) AS book_read_agg)
  FROM book AS b
  WHERE b.id = 11;

-- lists all books currently reading
(SELECT json_agg(row_to_json(is_reading_agg)) AS is_reading
  FROM (
    SELECT
      b.title,
      b.total_pages,
      b.blurb,
      b.picture_link,
      (SELECT json_agg(row_to_json(book_read_agg)) AS book_read
        FROM (
          SELECT
            br.id,
            br.days_read,
            br.days_total,
            (SELECT json_agg(row_to_json(read_entry_agg)) AS read_entry
              FROM (
                SELECT re.id, re.date_read, re.page_completed, re.percentage_completed
                  FROM read_entry AS re
                    WHERE re.book_read_id = br.id
                    ORDER BY re.date_read DESC
              ) AS read_entry_agg)
            WHERE rb.book_id = b.id
            ORDER BY br.id DESC
        ) AS book_read_agg)
    FROM book_read AS br
    INNER JOIN reader_book AS rb
    ON br.reader_book_id = rb.id
    INNER JOIN book AS b
    ON rb.book_id = b.id
    WHERE br.is_reading IS TRUE AND rb.reader_id = 1
  ) AS is_reading_agg);