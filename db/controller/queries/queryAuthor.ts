//Method 1: use plpgsql. checks if author exists before INSERT to prevent increasing author table's id count.
const queryPostAuthor = (bookId: number, authorList: string[]) => {
  const stringifiedInput = `ARRAY${JSON.stringify(authorList).replace(/"/g, "'")}`;
  return `
    CREATE OR REPLACE PROCEDURE post_author(author_array TEXT[])
    LANGUAGE plpgsql AS $$
    DECLARE
        var_author VARCHAR;
        var_author_id INT;
        var_first_name VARCHAR;
        var_middle_name VARCHAR;
        var_last_name VARCHAR;
    BEGIN
        FOREACH var_author IN ARRAY author_array
        LOOP
            SELECT id INTO var_author_id FROM author AS a WHERE a.full_name=var_author;
            IF NOT FOUND THEN
                var_first_name = (regexp_matches(var_author, '^([^\\s]+)'))[1];
                var_middle_name = (regexp_matches(var_author, '^[^\\s]+\\s(.*)\\s[^\\s]+$'))[1];
                IF var_middle_name IS NULL THEN
                    var_last_name = (regexp_matches(var_author, '\\s(.+)$'))[1];
                ELSE
                    var_last_name = (regexp_matches(var_author, '^[^\\s]+\\s.+\\s(.+)$'))[1];
                END IF;
                INSERT INTO author (full_name, first_name, middle_name, last_name) VALUES (var_author, var_first_name, var_middle_name, var_last_name) RETURNING id INTO var_author_id;
            END IF;
            INSERT INTO book_author (book_id, author_id) VALUES (${bookId}, var_author_id);
        END LOOP;
    END;
    $$;

    CALL post_author(ARRAY${JSON.stringify(authorList).replace(/"/g, "'")});

    DROP PROCEDURE post_author;
  `
};

const queryDeleteAuthor = (bookId: number, authorList: string[]) => {
  const stringifiedInput = `ARRAY${JSON.stringify(authorList).replace(/"/g, "'")}`;
  return `
  CREATE OR REPLACE PROCEDURE delete_author(author_array TEXT[])
  LANGUAGE plpgsql AS $$
  DECLARE
      var_author VARCHAR;
      var_author_id INT;
      var_book_author_id INT;
  BEGIN
      FOREACH var_author IN ARRAY author_array
      LOOP
          SELECT id INTO var_author_id FROM author AS a WHERE a.full_name=var_author;
          DELETE FROM book_author AS ba WHERE ba.book_id=${bookId} AND ba.author_id=var_author_id RETURNING id INTO var_book_author_id;
          DELETE FROM author WHERE author.id=var_author_id AND var_author_id NOT IN (SELECT ba.author_id FROM book_author AS ba);
      END LOOP;
  END;
  $$;

  CALL delete_author(ARRAY${JSON.stringify(authorList).replace(/"/g, "'")});

  DROP PROCEDURE delete_author;
  `
};

export { queryPostAuthor, queryDeleteAuthor }

// Method 2: multiple CTE queries.
// const queryPostAuthor = (bookId: number, authorList: string[]) => {
//   const combinedQuery = authorList.map(author => {
//     const authorArr = author.split(' ');
//     const firstName = authorArr.slice(0, 1)[0];
//     const middleName = authorArr.slice(1, -1).join(' ');
//     const lastName = authorArr.slice(-1)[0];
//     return `
//       WITH val AS (
//               SELECT  id
//               FROM    author
//               WHERE   full_name = '${author}'),
//       ins (id) AS (
//               INSERT INTO author (full_name, first_name, middle_name, last_name)
//               VALUES ('${author}', '${firstName}', '${middleName}', '${lastName}')
//               ON CONFLICT (full_name) DO NOTHING
//               RETURNING id)
//       INSERT INTO book_author (book_id, author_id)
//       VALUES (
//               ${bookId},
//               (SELECT   COALESCE(val.id, ins.id)
//               FROM      val FULL JOIN ins
//               ON        val.id=ins.id));
//     `
//   });
//   return combinedQuery.join(' ');
// };

// const queryDeleteAuthor = (bookId: number, authorList: string[]) => {
  //   //1. delete row from book_author JOIN table based on author_id and book_id.
  //   //2. delete author from author table if it is orphaned from book_author table.
  //   const combinedQuery = authorList.map(author => `
  //     WITH cte_author AS (
    //             SELECT  id
    //             FROM    author
    //             WHERE   author.full_name = '${author}')
//     DELETE FROM   book_author AS ba
//     USING         cte_author
//     WHERE         ba.book_id = ${bookId}
//     AND           ba.author_id = cte_author.id;

//     DELETE FROM   author
//     WHERE         author.id = (SELECT id FROM author WHERE author.full_name = '${author}')
//     AND           author.id
//     NOT IN        (SELECT   ba.author_id
//                   FROM      book_author AS ba);
//     `
//   );
//   return combinedQuery.join(' ');
// };