const updateReaderBook = (readerBookId: number) => {
  return `
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
                  AND rb.id = ${readerBookId}) AS t2
    WHERE reader_book.id = ${readerBookId};
  `
};

export default updateReaderBook;