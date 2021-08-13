const getDailyReads = (reader_id: string) => {
  return (
    `
    SELECT     outer_re.date_read,
               sum(outer_re.pages_read)::INT AS total_pages_read,
               (
                     SELECT json_agg(row_to_json(breakdown_agg)) AS book_pages_breakdown
                     FROM   (
                                       SELECT     inner_b.title            AS book_title,
                                                  sum(inner_re.pages_read)::INT AS pages_read
                                       FROM       read_entry               AS inner_re
                                       INNER JOIN book_read                AS inner_br
                                       ON         inner_re.book_read_id = inner_br.id
                                       INNER JOIN reader_book AS inner_rb
                                       ON         inner_br.reader_book_id = inner_rb.id
                                       INNER JOIN book AS inner_b
                                       ON         inner_rb.book_id = inner_b.id
                                       WHERE      inner_re.date_read = outer_re.date_read
                                       AND        inner_re.pages_read > 0
                                       GROUP BY   inner_b.title) AS breakdown_agg)
    FROM       read_entry AS outer_re
    INNER JOIN book_read  AS outer_br
    ON         outer_re.book_read_id = outer_br.id
    INNER JOIN reader_book AS outer_rb
    ON         outer_br.reader_book_id = outer_rb.id
    INNER JOIN book AS outer_b
    ON         outer_rb.book_id = outer_b.id
    WHERE      outer_rb.reader_id = ${reader_id}
    GROUP BY   outer_re.date_read
    ORDER BY   outer_re.date_read DESC;
    `
  )
};

export default getDailyReads;