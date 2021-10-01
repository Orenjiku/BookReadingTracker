--Manually add 3rd read to book 19 Blood Angels Omnibus for testing
INSERT INTO read_instance (reader_book_id) VALUES (19);

INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id)
  SELECT '2021/9/25', 100, 100, 12.08, MAX(ri.id)
  FROM read_instance AS ri;
INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id)
  SELECT '2021/9/26', 100, 200, 24.15, MAX(ri.id)
  FROM read_instance AS ri;
INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id)
  SELECT '2021/9/27', 100, 300, 36.23, MAX(ri.id)
  FROM read_instance AS ri;
INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id)
  SELECT'2021/9/28', 100, 400, 48.31, MAX(ri.id)
  FROM read_instance AS ri;
INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id)
  SELECT '2021/9/29', 100, 500, 60.39, MAX(ri.id)
  FROM read_instance AS ri;

UPDATE read_instance
SET   days_read = 5,
      days_total = 5,
      pages_read = 500,
      max_daily_read = 100,
      is_reading = TRUE,
      is_finished = FALSE,
      is_dnf = FALSE
WHERE  read_instance.reader_book_id = 19
AND read_instance.id = (SELECT MAX(ri.id) FROM read_instance AS ri);

UPDATE reader_book AS rb
SET is_any_reading=TRUE,
    is_any_finished=TRUE,
    is_all_dnf=FALSE
WHERE rb.reader_id = 1
AND rb.book_id = 19;