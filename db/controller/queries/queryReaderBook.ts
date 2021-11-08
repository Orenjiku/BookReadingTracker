const queryGetReaderBook = ( readerBookId: number ) => {
  return `
    SELECT
        row_to_json(reader_book_agg) AS reader_book
    FROM
      (
          SELECT
              rb.id AS rb_id,
              rb.is_any_reading,
              rb.is_any_finished,
              rb.is_all_dnf,
              (
                  SELECT
                      COALESCE(json_agg(row_to_json(read_instance_agg)), '[]'::json) AS read_instance
                  FROM
                      (
                          SELECT
                              ri.id AS ri_id,
                              ri.days_read,
                              ri.days_total,
                              ri.pages_read,
                              ri.max_daily_read,
                              ri.is_reading,
                              ri.is_finished,
                              ri.is_dnf,
                              ri.reader_book_id,
                              (
                                  SELECT
                                      COALESCE(json_agg(row_to_json(read_entry_agg)), '[]'::json) AS read_entry
                                  FROM
                                      (
                                          SELECT
                                              re.id AS re_id,
                                              re.date_read,
                                              re.pages_read,
                                              re.current_page,
                                              re.current_percent
                                          FROM
                                              read_entry AS re
                                          WHERE
                                              re.read_instance_id = ri.id
                                          ORDER BY
                                              re.date_read DESC,
                                              re.current_page DESC
                                      ) AS read_entry_agg
                              )
                          FROM
                              read_instance AS ri
                          WHERE
                              ri.reader_book_id = rb.id
                          ORDER BY
                              ri.id DESC
                      ) AS read_instance_agg
              )
          FROM
              reader_book AS rb
          WHERE
              rb.id=${readerBookId}
      ) AS reader_book_agg;
  `
}

export { queryGetReaderBook }