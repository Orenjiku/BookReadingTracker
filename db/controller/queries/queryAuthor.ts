const queryPostAuthor = (bookId: number, authorList: string[]) => {
  const combinedQuery = authorList.map(author => {
    const authorArr = author.split(' ');
    const firstName = authorArr.slice(0, 1)[0];
    const middleName = authorArr.slice(1, -1)[0] || '';
    const lastName = authorArr.slice(-1)[0];
    return `
      WITH val AS (
              SELECT  id
              FROM    author
              WHERE   full_name = '${author}'),
      ins (id) AS (
              INSERT INTO author (full_name, first_name, middle_name, last_name)
              VALUES ('${author}', '${firstName}', '${middleName}', '${lastName}')
              ON CONFLICT (full_name) DO NOTHING
              RETURNING id)
      INSERT INTO book_author (book_id, author_id)
      VALUES (
              ${bookId},
              (SELECT   COALESCE(val.id, ins.id)
              FROM      val FULL JOIN ins
              ON        val.id=ins.id));
    `
  });
  return combinedQuery.join(' ');
}

const queryDeleteAuthor = (bookId: number, authorList: string[]) => {
  //1. delete row from book_author JOIN table based on author_id and book_id.
  //2. delete author from author table if it is orphaned from book_author table.
  const combinedQuery = authorList.map(author => `
    WITH cte_author AS (
            SELECT  id
            FROM    author
            WHERE   author.full_name = '${author}')
    DELETE FROM   book_author AS ba
    USING         cte_author
    WHERE         ba.book_id = ${bookId}
    AND           ba.author_id = cte_author.id;

    DELETE FROM   author
    WHERE         author.id = (SELECT id FROM author WHERE author.full_name = '${author}')
    AND           author.id
    NOT IN        (SELECT   ba.author_id
                  FROM      book_author AS ba);
    `
  );
  return combinedQuery.join(' ');
}

export { queryPostAuthor, queryDeleteAuthor }