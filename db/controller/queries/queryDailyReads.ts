const queryDailyReads = (reader_id: string) => {
  return (
    `
    SELECT
        DATE(outer_re.date_read),
        sum(outer_re.pages_read) AS total_pages_read,
        (
            SELECT
                json_agg(row_to_json(breakdown_agg)) AS book_pages_breakdown
            FROM
                (
                    SELECT
                        inner_b.title AS book_title,
                        sum(inner_re.pages_read) AS pages_read
                    FROM
                        read_entry AS inner_re
                        INNER JOIN read_instance AS inner_ri ON inner_re.read_instance_id = inner_ri.id
                        INNER JOIN reader_book AS inner_rb ON inner_ri.reader_book_id = inner_rb.id
                        INNER JOIN book AS inner_b ON inner_rb.book_id = inner_b.id
                    WHERE
                        DATE(inner_re.date_read) = DATE(outer_re.date_read)
                        AND inner_re.pages_read > 0
                    GROUP BY
                        inner_b.title
                ) AS breakdown_agg
        )
    FROM
        read_entry AS outer_re
        INNER JOIN read_instance AS outer_ri ON outer_re.read_instance_id = outer_ri.id
        INNER JOIN reader_book AS outer_rb ON outer_ri.reader_book_id = outer_rb.id
        INNER JOIN book AS outer_b ON outer_rb.book_id = outer_b.id
    WHERE
        outer_rb.reader_id = ${reader_id}
    GROUP BY
        outer_re.date_read
    ORDER BY
        outer_re.date_read DESC;
    `
  )
};

export default queryDailyReads;