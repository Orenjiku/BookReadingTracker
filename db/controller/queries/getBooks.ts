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
                                                                                                 re.pages_read,
                                                                                                 re.current_page,
                                                                                                 re.current_percent
                                                                                        FROM     read_entry AS re
                                                                                        WHERE    re.book_read_id = br.id
                                                                                        ORDER BY re.date_read DESC, re. current_page DESC) AS read_entry_agg)
                                                        WHERE    rb.book_id = b.id
                                                        ORDER BY br.id DESC ) AS book_read_agg)
                      FROM       book_read   AS br
                      INNER JOIN reader_book AS rb
                      ON         br.reader_book_id = rb.id
                      INNER JOIN book AS b
                      ON         rb.book_id = b.id
                      WHERE      br.is_reading IS ${is_reading.toString()}
                      AND        br.is_finished IS ${is_finished.toString()}
                      AND        rb.reader_id = ${reader_id}
                      ORDER BY   b.title_sort) AS books_agg;
    `
    )
}

export default getBooks;