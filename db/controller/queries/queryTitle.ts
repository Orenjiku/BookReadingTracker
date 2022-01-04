const queryPutTitle = (bookId: number, title: string, titleSort: string) => {
  return `
    CREATE OR REPLACE PROCEDURE put_title(arg_book_id INT, arg_title VARCHAR, arg_title_sort VARCHAR)
    LANGUAGE plpgsql AS $$
    BEGIN
        UPDATE book SET title = $2, title_sort = $3 WHERE book.id = $1;

        DELETE FROM   book
        WHERE         book.id = $1
        AND           book.id
        NOT IN        (SELECT   rb.book_id
                      FROM      reader_book AS rb);
    END;
    $$;

    CALL put_title(${bookId}, '${title}', '${titleSort}');

    DROP PROCEDURE put_title;
  `
}

export { queryPutTitle }