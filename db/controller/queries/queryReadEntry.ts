import updateReaderBook from "./helperQueries/updateReaderBook";
import updateReadInstance from "./helperQueries/updateReadInstance";

const queryPostReadEntry = (readerBookId: number, readInstanceId: number, dateString: string, currentPage: number, totalPages: number) => {
  //1. find previous read_entry and set var_prev_page to current_page, else set 0.
  //2. Insert new read_entry with pages_read calculated using currentPage - var_prev_page.
  //2. Update next_read_entry pages_read if exists.
  //3. update read_instance.
  //4. update reader_book.
  return `
    CREATE OR REPLACE PROCEDURE post_read_entry(arg_reader_book_id INT, arg_read_instance_id INT, arg_date_string VARCHAR, arg_current_page INT, arg_total_pages INT)
    LANGUAGE plpgsql AS $$
    DECLARE
        var_time_stamp TIMESTAMP =    TO_TIMESTAMP($3, 'YYYY-MM-DD HH24:MI:SS');
        var_prev_page INT =           (SELECT COALESCE(
                                          (SELECT     current_page
                                          FROM        read_entry AS re
                                          INNER JOIN  read_instance AS ri
                                          ON          re.read_instance_id=ri.id
                                          WHERE       re.date_read < var_time_stamp
                                          AND         ri.id = $2
                                          ORDER BY    re.date_read DESC
                                          LIMIT 1
                                      ), 0));
        var_next_read_entry_id INT =  (SELECT     re.id
                                      FROM        read_entry AS re
                                      INNER JOIN  read_instance AS ri
                                      ON          re.read_instance_id=ri.id
                                      WHERE       re.date_read > var_time_stamp
                                      AND         ri.id = $2
                                      ORDER BY    re.date_read ASC
                                      LIMIT 1);
    BEGIN
        INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id)
        VALUES (var_time_stamp, $4 - var_prev_page, $4, TRUNC($4::DECIMAL / $5 * 100, 2), $2);

        UPDATE  read_entry        AS re
        SET     pages_read =      (re.current_page - $4)
        WHERE   re.id =           var_next_read_entry_id;
    END;
    $$;

    CALL post_read_entry(${readerBookId}, ${readInstanceId}, '${dateString}', ${currentPage}, ${totalPages});

    DROP PROCEDURE post_read_entry;

    ${updateReadInstance(readerBookId, readInstanceId)}

    ${updateReaderBook(readerBookId)}
  `
}

const queryDeleteReadEntry = (readerBookId: number, readInstanceId: number, readEntryId: number, readEntryPagesRead: number) => {
  //1. update next read_entry.pages_read. Recalculate pages_read by adding next read_entry.pages_read and readEntryPagesRead (pages read from read entry to be deleted).
  //2. delete read_entry.
  //3. update read_instance.
  //4. update reader_book.
  return `
    CREATE OR REPLACE PROCEDURE delete_read_entry(arg_reader_book_id INT, arg_read_instance_id INT, arg_read_entry_id INT, arg_read_entry_pages_read INT)
    LANGUAGE plpgsql AS $$
    BEGIN
        WITH next_re AS (
                SELECT      re.id, re.pages_read
                FROM        read_entry AS re
                INNER JOIN  read_instance AS ri
                ON          re.read_instance_id = $2
                AND         re.date_read > (SELECT date_read FROM read_entry AS re WHERE re.id = $3)
                ORDER BY    date_read ASC
                LIMIT 1)
        UPDATE      read_entry
        SET         pages_read = next_re.pages_read + $4
        FROM        next_re
        WHERE       read_entry.id = next_re.id;

        DELETE FROM read_entry AS re WHERE re.id = $3;
    END;
    $$;

    CALL delete_read_entry(${readerBookId}, ${readInstanceId}, ${readEntryId}, ${readEntryPagesRead});

    DROP PROCEDURE delete_read_entry;

    ${updateReadInstance(readerBookId, readInstanceId)}

    ${updateReaderBook(readerBookId)}
  `
}

export { queryPostReadEntry, queryDeleteReadEntry }