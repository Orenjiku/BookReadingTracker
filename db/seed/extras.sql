/* --------------------------------------------- ADD 2nd read_instance to Book 19 Blood Angels Omnibus for testing --------------------------------------------- */

CREATE OR REPLACE FUNCTION add_another_read_instance(arg_username VARCHAR, arg_book_title VARCHAR)
RETURNS VOID AS $$
DECLARE
  var_reader_book_id INT = get_reader_book_id($1, $2);
  --Find current max read_instance_id and add 1 for new read_instance_id
  var_read_instance_id INT := (SELECT MAX(ri.id) FROM read_instance AS ri) + 1;
BEGIN
  --Add new read_instance and reference reader_book
  INSERT INTO read_instance (reader_book_id) VALUES (var_reader_book_id);

  --Add a few read_entries
  INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id) VALUES ('2021/9/1', 100, 100, 12.08, var_read_instance_id);
  INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id) VALUES ('2021/9/2', 100, 200, 24.15, var_read_instance_id);
  INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id) VALUES ('2021/9/3', 100, 300, 36.23, var_read_instance_id);
  INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id) VALUES ('2021/9/4', 100, 400, 48.31, var_read_instance_id);
  INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id) VALUES ('2021/9/5', 100, 500, 60.39, var_read_instance_id);
  INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id) VALUES ('2021/9/6', 100, 600, 72.46, var_read_instance_id);
  INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id) VALUES ('2021/9/7', 100, 700, 84.54, var_read_instance_id);
  INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id) VALUES ('2021/9/8', 100, 800, 96.61, var_read_instance_id);
  INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id) VALUES ('2021/9/9', 28, 828, 100, var_read_instance_id);

  --Update read_instance meta data based on previously added read_entries
  UPDATE read_instance
  SET   days_read =   (SELECT COUNT(DISTINCT Date(re.date_read)) AS days_read
                      FROM   read_instance AS ri
                      INNER JOIN read_entry AS re
                      ON re.read_instance_id = var_read_instance_id),
        days_total =  (SELECT (MAX(Date(re.date_read)) - MIN(Date(re.date_read)) + 1) AS days_total
                      FROM   read_entry AS re
                      WHERE  re.read_instance_id = var_read_instance_id),
        pages_read =      (SELECT SUM(re.pages_read) FROM read_entry AS re WHERE re.read_instance_id = var_read_instance_id),
        max_daily_read = (SELECT MAX(daily_read.daily_pages_read)
                          FROM   (SELECT SUM(pages_read) AS daily_pages_read
                                  FROM   read_entry AS re
                                  WHERE re.read_instance_id = var_read_instance_id
                                  GROUP  BY Date(re.date_read))
                          AS daily_read),
        is_reading = FALSE,
        is_finished = TRUE,
        is_dnf = FALSE
  WHERE read_instance.reader_book_id = var_reader_book_id
  AND read_instance.id = var_read_instance_id;

  --Update meta data for reader_book based on previously added read_intance
  UPDATE reader_book AS rb
  SET is_any_reading=(SELECT bool_or(ri.is_reading) FROM read_instance AS ri WHERE ri.reader_book_id = var_reader_book_id),
      is_any_finished=(SELECT bool_or(ri.is_finished) FROM read_instance aS ri WHERE ri.reader_book_id = var_reader_book_id),
      is_all_dnf=(SELECT bool_and(ri.is_dnf) FROM read_instance AS ri WHERE ri.reader_book_id = var_reader_book_id)
  WHERE rb.reader_id = get_reader_id($1)
  AND rb.book_id = get_book_id($2);
END;
$$ LANGUAGE plpgsql;


SELECT add_another_read_instance(:'username_1', :'book_19_title');
------------------------------------------------------------------------------------------------------------------------------------


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