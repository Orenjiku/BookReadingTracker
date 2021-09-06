const getBooks = (reader_id: string, is_reading: boolean, is_finished: boolean) => {
    return (
    `
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
                                 b.published_date,
                                 b.published_date_edition,
                                 b.book_format,
                                 b.total_pages,
                                 b.blurb,
                                 b.picture_link,
                                 (
                                        SELECT json_agg(row_to_json(reader_book_agg)) AS reader_book
                                        FROM   (
                                                        SELECT   rb.id AS rb_id,
                                                                 rb.days_read,
                                                                 rb.days_total,
                                                                 rb.is_reading,
                                                                 rb.is_finished,
                                                                 (
                                                                        SELECT json_agg(row_to_json(read_entry_agg)) AS read_entry
                                                                        FROM   (
                                                                                        SELECT   re.id AS re_id,
                                                                                                 re.date_read,
                                                                                                 re.pages_read,
                                                                                                 re.current_page,
                                                                                                 re.current_percent
                                                                                        FROM     read_entry AS re
                                                                                        WHERE    re.reader_book_id = rb.id
                                                                                        ORDER BY re.date_read DESC, re.current_page DESC) AS read_entry_agg)
                                                        WHERE    rb.book_id = b.id
                                                        ORDER BY rb.id DESC ) AS reader_book_agg)
                      FROM       reader AS r
                      INNER JOIN reader_book AS rb
                      ON         r.id = rb.reader_id
                      INNER JOIN book AS b
                      ON         rb.book_id = b.id
                      WHERE      r.id = ${reader_id}
                      AND        rb.is_reading IS ${is_reading.toString()}
                      AND        rb.is_finished IS ${is_finished.toString()}
                      ORDER BY   b.title_sort) AS books_agg;
    `
    )
}

export default getBooks;