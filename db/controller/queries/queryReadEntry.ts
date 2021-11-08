const queryPostReadEntry = (readerBookId: number, readInstanceId: number, dateString: string, currentPage: number, totalPages: number) => {
  const toTimeStamp = `TO_TIMESTAMP('${dateString}', 'YYYY-MM-DD HH24:MI:SS')`;
  const isReading = currentPage < totalPages ? 'TRUE' : 'FALSE';
  const isFinished = currentPage >= totalPages ? 'TRUE' : 'FALSE';
  //1. insert new read_entry. Calculate new read_entry.pages_read by subtracting previous entry's current_page from currentPage.
  //2. update next read_entry.pages_read. Recalculate pages_read by subtracting currentPage from its current_page.
  //3. update read_instance meta using aggregation functions.
  //4. update reader_book using aggregation functions. Same function used in queryDeleteReadEntry.
  return `
    INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id)
        (SELECT     ${toTimeStamp},
                    ${currentPage} - re.current_page,
                    ${currentPage},
                    TRUNC(${currentPage}::DECIMAL / ${totalPages} * 100, 2),
                    ${readInstanceId}
        FROM        read_entry AS re
        INNER JOIN  read_instance AS ri
        ON          re.read_instance_id=ri.id
        WHERE       re.date_read < ${toTimeStamp}
        AND         ri.id = ${readInstanceId}
        ORDER BY    re.date_read DESC
        LIMIT 1);

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

    UPDATE  read_instance
    SET     days_read =         (SELECT   COUNT(DISTINCT Date(re.date_read)) AS days_read
                                FROM      read_entry AS re
                                WHERE     re.read_instance_id = ${readInstanceId}),
            days_total =        (SELECT   COALESCE((MAX(Date(re.date_read)) - MIN(Date(re.date_read)) + 1), 0) AS days_total
                                FROM      read_entry AS re
                                WHERE     re.read_instance_id = ${readInstanceId}),
            pages_read =        (SELECT   COALESCE(SUM(re.pages_read), 0)
                                FROM      read_entry AS re
                                WHERE     re.read_instance_id = ${readInstanceId}),
            max_daily_read =    (SELECT   COALESCE(MAX(daily_read.daily_pages_read), 0)
                                FROM      (SELECT   SUM(pages_read) AS daily_pages_read
                                          FROM      read_entry AS re
                                          WHERE     re.read_instance_id = ${readInstanceId}
                                          GROUP     BY Date(re.date_read))
                                          AS        daily_read),
            is_reading =        ${isReading},
            is_finished =       ${isFinished}
    WHERE   read_instance.id =  ${readInstanceId};

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
}

const queryDeleteReadEntry = (readerBookId: number, readInstanceId: number, readEntryId: number, readEntryPagesRead: number) => {
  //1. update next read_entry.pages_read. Recalculate pages_read by adding next read_entry.pages_read and readEntryPagesRead (pages read from read entry to be deleted).
  //2. delete read_entry
  //3. update read_instance meta data using aggregation functions. Does not update read_instance is_reading or is_finished in this step.
  //4. update read_instance is_reading and is_finished in separate step because it depends on the updated values from step 3.
  //5. update reader_book using aggregation functions. Same function as queryPostReadEntry.
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

    UPDATE  read_instance
    SET     days_read =         (SELECT   COUNT(DISTINCT Date(re.date_read)) AS days_read
                                FROM      read_entry AS re
                                WHERE     re.read_instance_id = ${readInstanceId}),
            days_total =        (SELECT   COALESCE((MAX(Date(re.date_read)) - MIN(Date(re.date_read)) + 1), 0) AS days_total
                                FROM      read_entry AS re
                                WHERE     re.read_instance_id = ${readInstanceId}),
            pages_read =        (SELECT   COALESCE(SUM(re.pages_read), 0)
                                FROM      read_entry AS re
                                WHERE     re.read_instance_id = ${readInstanceId}),
            max_daily_read =    (SELECT   COALESCE(MAX(daily_read.daily_pages_read), 0)
                                FROM      (SELECT   SUM(pages_read) AS daily_pages_read
                                          FROM      read_entry AS re
                                          WHERE     re.read_instance_id = ${readInstanceId}
                                          GROUP BY  Date(re.date_read))
                                          AS        daily_read)
    WHERE   read_instance.id =  ${readInstanceId};

    WITH cte_book AS (
            SELECT      b.id, b.total_pages
            FROM        book AS b
            INNER JOIN  reader_book AS rb
            ON          b.id = rb.book_id
            WHERE       rb.id = ${readerBookId})
    UPDATE  read_instance AS ri
    SET     is_reading =          (SELECT (CASE WHEN ri.pages_read < cte_book.total_pages THEN TRUE ELSE FALSE END) AS is_reading),
            is_finished =         (SELECT (CASE WHEN ri.pages_read >= cte_book.total_pages THEN TRUE ELSE FALSE END) AS is_finished)
    FROM    cte_book
    WHERE   ri.reader_book_id =   ${readerBookId};

    UPDATE  reader_book AS rb
    SET     is_any_reading =    (SELECT bool_or(ri.is_reading)
                                FROM read_instance AS ri
                                WHERE ri.reader_book_id = rb.id),
            is_any_finished =   (SELECT bool_or(ri.is_finished)
                                FROM read_instance aS ri
                                WHERE ri.reader_book_id = rb.id)
    WHERE   rb.id =             ${readerBookId};
  `
}

export { queryPostReadEntry, queryDeleteReadEntry }