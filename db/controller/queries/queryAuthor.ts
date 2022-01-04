//Method 1: use plpgsql. checks if author exists before INSERT to prevent increasing author table's id count.
const queryPostAuthor = (bookId: number, authorList: string[]) => {
    //1. Loop through author array
    //2. Check if author exists in author table.
    //3. If not exist, insert author into author table.
    //4. If exist, connect author with book by inserting book_id and author_id into book_author JOIN table.
    return `
        CREATE OR REPLACE PROCEDURE post_author(arg_book_id INT, arg_author_arr TEXT[])
        LANGUAGE plpgsql AS $$
        DECLARE
            var_author VARCHAR;
            var_author_id INT;
            var_first_name VARCHAR;
            var_middle_name VARCHAR;
            var_last_name VARCHAR;
        BEGIN
            FOREACH var_author IN ARRAY arg_author_arr
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
                INSERT INTO book_author (book_id, author_id) VALUES (arg_book_id, var_author_id);
            END LOOP;
        END;
        $$;

        CALL post_author(${bookId}, ARRAY${JSON.stringify(authorList).replace(/"/g, "'")});

        DROP PROCEDURE post_author;
    `
};

const queryDeleteAuthor = (bookId: number, authorList: string[]) => {
    //1. Loop through author array
    //2. If author exists in author table,
    //3. Delete connection between book and author from the book_author JOIN table.
    //4. Delete author from author table, if author is not connected to a book, i.e. NOT IN book_author JOIN table. (slow if a lot of authors?)
    return `
        CREATE OR REPLACE PROCEDURE delete_author(arg_book_id INT, arg_author_arr TEXT[])
        LANGUAGE plpgsql AS $$
        DECLARE
            var_author VARCHAR;
            var_author_id INT;
            var_book_author_id INT;
        BEGIN
            FOREACH var_author IN ARRAY arg_author_arr
            LOOP
                SELECT id INTO var_author_id FROM author AS a WHERE a.full_name = var_author;
                DELETE FROM book_author AS ba WHERE ba.book_id=arg_book_id AND ba.author_id = var_author_id RETURNING id INTO var_book_author_id;
                DELETE FROM author WHERE author.id = var_author_id AND var_author_id NOT IN (SELECT ba.author_id FROM book_author AS ba);
            END LOOP;
        END;
        $$;

        CALL delete_author(${bookId}, ARRAY${JSON.stringify(authorList).replace(/"/g, "'")});

        DROP PROCEDURE delete_author;
`
};

export { queryPostAuthor, queryDeleteAuthor }