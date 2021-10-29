const queryPostAuthor = (bookId: number, authorList: string[]) => {
  const combinedQuery = authorList.map(author => {
    const authorArr = author.split(' ');
    const firstName = authorArr.slice(0, 1)[0];
    const middleName = authorArr.slice(1, -1)[0] || '';
    const lastName = authorArr.slice(-1)[0];
    return `
      WITH val AS (SELECT id FROM author WHERE full_name='${author}')
      , ins (id) AS (
          INSERT INTO author (full_name, first_name, middle_name, last_name)
          VALUES ('${author}', '${firstName}', '${middleName}', '${lastName}')
          ON CONFLICT (full_name) DO NOTHING
          RETURNING id
          )
      INSERT INTO book_author (book_id, author_id) VALUES (${bookId}, (SELECT COALESCE(val.id, ins.id) FROM val FULL JOIN ins ON val.id=ins.id));
    `
  });
  return `BEGIN; ${combinedQuery.join(' ')} COMMIT;`
}

const queryDeleteAuthor = (bookId: number, authorList: string[]) => {
  const combinedQuery = authorList.map(author =>
    `DELETE FROM book_author USING book WHERE book_author.book_id=${bookId} AND book_author.author_id=(SELECT id FROM author WHERE author.full_name='${author}');`
  );
  return `BEGIN; ${combinedQuery.join(' ')} COMMIT;`
}

export { queryPostAuthor, queryDeleteAuthor }