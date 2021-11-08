const queryPutTotalPages = (bookId: number, readerBookId: number, totalPages: number) => {
  //1. update total pages of book.
  //2. update every read entry's current_percent from reader_book.
  //3. update every read_instance's is_reading and is_finished based on pages_read vs total pages.
  //4. update reader_book's is_any_reading and is_any_finished based on updated read_instances from #3.
  return `
    UPDATE book AS b SET total_pages = ${totalPages} WHERE b.id = ${bookId};

    UPDATE  read_entry AS re
    SET     current_percent=TRUNC(current_page::DECIMAL / ${totalPages} * 100, 2)
    FROM    read_instance AS ri
    WHERE   re.read_instance_id = ri.id
    AND     ri.reader_book_id = ${readerBookId};

    UPDATE  read_instance AS ri
    SET     is_reading =    (SELECT (CASE WHEN pages_read < ${totalPages} THEN TRUE ELSE FALSE END) AS is_reading),
            is_finished =   (SELECT (CASE WHEN pages_read >= ${totalPages} THEN TRUE ELSE FALSE END) AS is_finished)
    WHERE   ri.reader_book_id = ${readerBookId};

    UPDATE  reader_book AS rb
    SET     is_any_reading =    (SELECT bool_or(ri.is_reading)
                                FROM read_instance AS ri
                                WHERE ri.reader_book_id = rb.id),
            is_any_finished =   (SELECT bool_or(ri.is_finished)
                                FROM read_instance aS ri
                                WHERE ri.reader_book_id = rb.id)
    WHERE rb.id = ${readerBookId};
  `
}

export { queryPutTotalPages }