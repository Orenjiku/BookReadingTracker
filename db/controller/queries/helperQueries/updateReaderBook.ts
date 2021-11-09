const updateReaderBook = (readerBookId: number) => {
  return `
    UPDATE  reader_book AS rb
    SET     is_any_reading =    (SELECT bool_or(ri.is_reading)
                                FROM read_instance AS ri
                                WHERE ri.reader_book_id = rb.id),
            is_any_finished =   (SELECT bool_or(ri.is_finished)
                                FROM read_instance aS ri
                                WHERE ri.reader_book_id = rb.id),
            is_all_dnf =        (SELECT bool_and(ri.is_dnf)
                                FROM read_instance AS ri
                                WHERE ri.reader_book_id = rb.id)
    WHERE   rb.id =             ${readerBookId};
  `
};

export default updateReaderBook;