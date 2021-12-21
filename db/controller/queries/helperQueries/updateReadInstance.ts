const updateReadInstance = (readerBookId: number, readInstanceId: number) => {
  //1. update read_instance meta data using aggregation functions. Does not update is_reading or is_finished in this step.
  //2. update read_instance is_reading and is_finished after pages_read in step 1 have been updated.
  return `
    UPDATE  read_instance
    SET     days_read =       t2.days_read,
            days_total =      t2.days_total,
            pages_read =      t2.pages_read,
            max_daily_read =  (SELECT   COALESCE(MAX(daily_read.daily_pages_read), 0)
                              FROM      (SELECT   SUM(pages_read) AS daily_pages_read
                                        FROM      read_entry AS re
                                        WHERE     re.read_instance_id = ${readInstanceId}
                                        GROUP     BY Date(re.date_read)) AS daily_read)
    FROM    (SELECT   COUNT(DISTINCT Date(re.date_read)) AS days_read,
                      COALESCE(MAX(Date(re.date_read)) - MIN(Date(re.date_read)) + 1, 0) AS days_total,
                      COALESCE(SUM(re.pages_read), 0) AS pages_read
            FROM      read_entry AS re
            WHERE     re.read_instance_id = ${readInstanceId}) AS t2
    WHERE   read_instance.id = ${readInstanceId};

    WITH cte_book AS (
              SELECT      b.id, b.total_pages
              FROM        book AS b
              INNER JOIN  reader_book AS rb
              ON          b.id = rb.book_id
              WHERE       rb.id = ${readerBookId})
    UPDATE    read_instance AS ri
    SET       is_reading =          (SELECT (CASE WHEN ri.pages_read < cte_book.total_pages THEN TRUE ELSE FALSE END) AS is_reading),
              is_finished =         (SELECT (CASE WHEN ri.pages_read >= cte_book.total_pages THEN TRUE ELSE FALSE END) AS is_finished)
    FROM      cte_book
    WHERE     ri.reader_book_id =   ${readerBookId};
  `
};

export default updateReadInstance;