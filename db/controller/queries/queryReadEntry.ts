import updateReaderBook from "./helperQueries/updateReaderBook";
import updateReadInstance from "./helperQueries/updateReadInstance";

const queryPostReadEntry = (readerBookId: number, readInstanceId: number, dateString: string, currentPage: number, totalPages: number) => {
  const toTimeStamp = `TO_TIMESTAMP('${dateString}', 'YYYY-MM-DD HH24:MI:SS')`;
  //1. find previous read_entry and get current_page if exists, else return 0. Insert read_entry with pages_read calculated using previous read_entry current_page.
  //2. update next read_entry.pages_read. Recalculate pages_read by subtracting currentPage from its current_page.
  //3. update read_instance.
  //4. update reader_book.
  return `
    WITH prev_read_entry AS (
        SELECT COALESCE(
              (SELECT     current_page
              FROM        read_entry AS re
              INNER JOIN  read_instance AS ri
              ON          re.read_instance_id=ri.id
              WHERE       re.date_read < ${toTimeStamp}
              AND         ri.id = ${readInstanceId}
              ORDER BY    re.date_read DESC
              LIMIT 1
        ), 0) AS current_page)
    INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id)
        (SELECT     ${toTimeStamp},
                    ${currentPage} - pre.current_page,
                    ${currentPage},
                    TRUNC(${currentPage}::DECIMAL / ${totalPages} * 100, 2),
                    ${readInstanceId}
        FROM        prev_read_entry AS pre);

    UPDATE  read_entry
    SET     pages_read =      (read_entry.current_page - ${currentPage})
    WHERE   read_entry.id =   (SELECT     re.id
                              FROM        read_entry AS re
                              INNER JOIN  read_instance AS ri
                              ON          re.read_instance_id=ri.id
                              WHERE       re.date_read > ${toTimeStamp}
                              AND         ri.id = ${readInstanceId}
                              ORDER BY    re.date_read ASC
                              LIMIT 1);

    ${updateReadInstance(readerBookId, readInstanceId)}

    ${updateReaderBook(readerBookId)}
  `
}

const queryDeleteReadEntry = (readerBookId: number, readInstanceId: number, readEntryId: number, readEntryPagesRead: number) => {
  //1. update next read_entry.pages_read. Recalculate pages_read by adding next read_entry.pages_read and readEntryPagesRead (pages read from read entry to be deleted).
  //2. delete read_entry
  //3. update read_instance.
  //4. update reader_book.
  return `
    WITH next_re AS (
            SELECT      re.id, re.pages_read
            FROM        read_entry AS re
            INNER JOIN  read_instance AS ri
            ON          re.read_instance_id = ${readInstanceId}
            AND         re.date_read > (SELECT date_read FROM read_entry AS re WHERE re.id = ${readEntryId})
            ORDER BY    date_read ASC
            LIMIT 1)
    UPDATE      read_entry
    SET         pages_read = next_re.pages_read + ${readEntryPagesRead}
    FROM        next_re
    WHERE       read_entry.id = next_re.id;

    DELETE FROM read_entry AS re WHERE re.id = ${readEntryId};

    ${updateReadInstance(readerBookId, readInstanceId)}

    ${updateReaderBook(readerBookId)}
  `
}

export { queryPostReadEntry, queryDeleteReadEntry }