const queryGetReading = (readerId: string, isReading: boolean) => {
    return `
        SELECT
            COALESCE(json_agg(row_to_json(books_agg)), '[]'::json) AS books
        FROM
            (
                SELECT
                    b.id AS b_id,
                    b.title,
                    (
                        SELECT
                            COALESCE(array_agg(full_name ORDER BY a.last_name ASC), ARRAY[]::TEXT[]) AS author
                        FROM
                            author AS a
                            INNER JOIN book_author AS ba ON a.id = ba.author_id
                        WHERE
                            ba.book_id = b.id
                    ),
                    b.book_format,
                    b.total_pages,
                    b.published_date,
                    b.edition_date,
                    b.book_cover_url,
                    b.blurb,
                    (
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
                                                                    re.date_read DESC
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
                                    rb.reader_id = r.id
                                    AND rb.book_id = b.id
                            ) AS reader_book_agg
                    )
                FROM
                    reader AS r
                    INNER JOIN reader_book AS rb ON r.id = rb.reader_id
                    INNER JOIN book AS b ON rb.book_id = b.id
                WHERE
                    r.id = '${readerId}'
                    ${isReading
                        ? 'AND rb.is_any_reading = TRUE'
                        : 'AND rb.is_any_reading = FALSE AND rb.is_any_finished = TRUE'}
                ORDER BY
                    b.title_sort
                ) AS books_agg;
    `
}

export default queryGetReading;