const queryPostBook = (readerId: string, title: string, titleSort: string, format: string, totalPages: number, pgSqlAuthor: string, publishedDate: string, editionDate: string, bookCoverUrl: string, pgSqlBlurb: string) => {
    //1. Check if book title exists in book table.
    //2. If not exist, add book into book table and add author into author table and connect book and author with book_author JOIN table.
    //3. Create reader_book entry to connect reader with book.
    //4. Create read_instance for future read_entries.
    return`
        CREATE OR REPLACE PROCEDURE post_book(arg_reader_id INT, arg_title VARCHAR, arg_title_sort VARCHAR, arg_book_format VARCHAR, arg_total_pages INT, arg_author_arr TEXT[], arg_published_date VARCHAR, arg_edition_date VARCHAR, arg_book_cover_url VARCHAR, arg_blurb VARCHAR)
        LANGUAGE plpgsql AS $$
        DECLARE
            var_book_id INT = (SELECT id FROM book WHERE book.title = $2);
            var_author VARCHAR;
            var_author_id INT;
            var_first_name VARCHAR;
            var_middle_name VARCHAR;
            var_last_name VARCHAR;
            var_reader_book_id INT;
        BEGIN
            IF var_book_id IS NULL THEN
                INSERT INTO book (title, title_sort, book_format, total_pages, published_date, edition_date, book_cover_url, blurb) VALUES ($2, $3, $4, $5, NULLIF($7, '')::DATE, NULLIF($8, '')::DATE, $9, $10) RETURNING id INTO var_book_id;

                FOREACH var_author IN ARRAY $6
                LOOP
                    SELECT id INTO var_author_id FROM author AS a WHERE a.full_name = var_author;
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
                    INSERT INTO book_author (book_id, author_id) VALUES (var_book_id, var_author_id);
                END LOOP;

                INSERT INTO reader_book (is_any_reading, reader_id, book_id) VALUES (TRUE, $1, var_book_id) RETURNING id INTO var_reader_book_id;
                INSERT INTO read_instance(is_reading, reader_book_id) VALUES (TRUE, var_reader_book_id);
            END IF;
        END;
        $$;

        CALL post_book(${readerId}, '${title}', '${titleSort}', '${format}', ${totalPages}, '${pgSqlAuthor}', '${publishedDate}', '${editionDate}', '${bookCoverUrl}', '${pgSqlBlurb}');

        DROP PROCEDURE post_book;
    `
}

const queryDeleteBook = (bookId: number) => {
    //1. Delete book from book table.
    //2. Delete rows related to book from book_author table.
    //2. Loop through author_id array
    //3. Delete author from author table, if author is not connected to a book, i.e. NOT IN book_author JOIN table. (slow if a lot of authors?)
    return `
        CREATE OR REPLACE PROCEDURE delete_book(arg_book_id INT)
        LANGUAGE plpgsql AS $$
        DECLARE
            var_author_id_arr INT[] = ARRAY(SELECT author.id FROM author INNER JOIN book_author ON author.id = book_author.author_id WHERE book_author.book_id = arg_book_id);
            var_author_id INT;
        BEGIN
            DELETE FROM book WHERE book.id = $1;
            DELETE FROM book_author WHERE book_author.book_id = $1;
            FOREACH var_author_id IN ARRAY var_author_id_arr
            LOOP
                DELETE FROM author WHERE author.id = var_author_id AND var_author_id NOT IN (SELECT ba.author_id FROM book_author AS ba);
            END LOOP;
        END;
        $$;

        CALL delete_book(${bookId});

        DROP PROCEDURE delete_book;
    `
}

export { queryPostBook, queryDeleteBook }