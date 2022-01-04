import updateReaderBook from "./helperQueries/updateReaderBook"

const queryPutTotalPages = (bookId: number, readerBookId: number, totalPages: number) => {
  //1. update total pages of book.
  //2. update every read entry's current_percent from reader_book.
  //3. update every read_instance's is_reading and is_finished based on pages_read vs total pages.
  //4. update reader_book.
  return `
    CREATE OR REPLACE PROCEDURE put_total_pages(arg_book_id INT, arg_reader_book_id INT, arg_total_pages INT)
    LANGUAGE plpgsql AS $$
    BEGIN
        UPDATE book AS b SET total_pages = $3 WHERE b.id = $1;

        UPDATE  read_entry AS re
        SET     current_percent = TRUNC(current_page::DECIMAL / $3 * 100, 2)
        FROM    read_instance AS ri
        WHERE   re.read_instance_id = ri.id
        AND     ri.reader_book_id = $2;

        UPDATE  read_instance AS ri
        SET     is_reading =    (SELECT (CASE WHEN pages_read < $3 THEN TRUE ELSE FALSE END) AS is_reading),
                is_finished =   (SELECT (CASE WHEN pages_read >= $3 THEN TRUE ELSE FALSE END) AS is_finished)
        WHERE   ri.reader_book_id = $2;
    END;
    $$;

    CALL put_total_pages(${bookId}, ${readerBookId}, ${totalPages});

    DROP PROCEDURE put_total_pages;

    ${updateReaderBook(readerBookId)}
  `
}

export { queryPutTotalPages }