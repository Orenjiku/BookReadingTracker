const queryPutTitle = (bookId: number, title: string, titleSort: string) => {
  return `
    UPDATE book SET title='${title}', title_sort='${titleSort}' WHERE book.id=${bookId};

    DELETE FROM   book
    WHERE         book.id = ${bookId}
    AND           book.id
    NOT IN        (SELECT   rb.book_id
                  FROM      reader_book AS rb);
  `
}

export { queryPutTitle }