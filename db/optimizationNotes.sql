-------------------- updateReaderBook --------------------
--                   Test 1        Test 2        Test3          Avg
-- Planning Time:    1.290         1.260         1.626          1.392
-- Execution Time:   0.839         0.418         0.529          0.595
-- Total Time:       2.129         1.678         2.155          1.987
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
WHERE   rb.id =             24;

--                   Test 1        Test 2        Test3          Avg
-- Planning Time:    0.323         0.323         0.319          0.322
-- Execution Time:   0.162         0.174         0.163          0.166
-- Total Time:       0.485         0.497         0.482          0.488
UPDATE  reader_book
SET     is_any_reading =     t2.is_any_reading,
        is_any_finished =    t2.is_any_finished,
        is_all_dnf =         t2.is_any_dnf
FROM  (SELECT     bool_or(ri.is_reading) AS is_any_reading,
                  bool_or(ri.is_finished) AS is_any_finished,
                  bool_and(ri.is_dnf) AS is_any_dnf
      FROM        read_instance AS ri
      INNER JOIN  reader_book AS rb
      ON          ri.reader_book_id = rb.id
      AND         rb.id = 24) AS t2
WHERE   reader_book.id = 24;

--RESULT: Method 2 is 4x faster than Method 1.
--NOTE: correlated subqueries are generally much more expensive
-----------------------------------------------------------




-------------------- updateReadInstance --------------------
-- METHOD 1: Using correlated subqueries.
--                   Test 1        Test 2        Test3          Avg
-- Planning Time:    0.975         1.187         1.350          1.171
-- Execution Time:   0.184         0.239         0.243          0.222
-- Total Time:       1.159         1.426         1.593          1.393
EXPLAIN ANALYZE
UPDATE  read_instance
SET     days_read =         (SELECT   COUNT(DISTINCT Date(re.date_read)) AS days_read
                            FROM      read_entry AS re
                            WHERE     re.read_instance_id = 24),
        days_total =        (SELECT   COALESCE((MAX(Date(re.date_read)) - MIN(Date(re.date_read)) + 1), 0) AS days_total
                            FROM      read_entry AS re
                            WHERE     re.read_instance_id = 24),
        pages_read =        (SELECT   COALESCE(SUM(re.pages_read), 0)
                            FROM      read_entry AS re
                            WHERE     re.read_instance_id = 24),
        max_daily_read =    (SELECT   COALESCE(MAX(daily_read.daily_pages_read), 0)
                            FROM      (SELECT   SUM(pages_read) AS daily_pages_read
                                      FROM      read_entry AS re
                                      WHERE     re.read_instance_id = 24
                                      GROUP     BY Date(re.date_read))
                                      AS        daily_read)
WHERE   read_instance.id =  24;

-- METHOD 2: Reduce the number of correlated subqueries.
--                   Test 1        Test 2        Test3          Avg
-- Planning Time:    1.261         1.207         0.952          1.14
-- Execution Time:   0.224         0.220         0.173          0.206
-- Total Time:       2.129         1.678         2.155          1.346
EXPLAIN ANALYZE
UPDATE  read_instance
SET     days_read =       t2.days_read,
        days_total =      t2.days_total,
        pages_read =      t2.pages_read,
        max_daily_read =  (SELECT   COALESCE(MAX(daily_read.daily_pages_read), 0)
                          FROM      (SELECT   SUM(pages_read) AS daily_pages_read
                                    FROM      read_entry AS re
                                    WHERE     re.read_instance_id = 24
                                    GROUP     BY Date(re.date_read)) AS daily_read)
FROM    (SELECT   COUNT(DISTINCT Date(re.date_read)) AS days_read,
                  COALESCE(MAX(Date(re.date_read)) - MIN(Date(re.date_read)) + 1, 0) AS days_total,
                  COALESCE(SUM(re.pages_read), 0) AS pages_read
        FROM      read_entry AS re
        WHERE     re.read_instance_id = 24) AS t2
WHERE   read_instance.id = 24;

-- METHOD 3: Use 2 queries. Create separate query for max_daily_read.
EXPLAIN ANALYZE
UPDATE  read_instance
SET     days_read =       t2.days_read,
        days_total =      t2.days_total,
        pages_read =      t2.pages_read
FROM    (SELECT   COUNT(DISTINCT Date(re.date_read)) AS days_read,
                  COALESCE(MAX(Date(re.date_read)) - MIN(Date(re.date_read)) + 1, 0) AS days_total,
                  COALESCE(SUM(re.pages_read), 0) AS pages_read
        FROM      read_entry AS re
        WHERE     re.read_instance_id = 24) AS t2
WHERE   read_instance.id = 24;

UPDATE  read_instance
SET     max_daily_read =  (SELECT   COALESCE(MAX(daily_read.daily_pages_read), 0)
                          FROM      (SELECT   SUM(pages_read) AS daily_pages_read
                                    FROM      read_entry AS re
                                    WHERE     re.read_instance_id = 24
                                    GROUP     BY Date(re.date_read)) AS daily_read)
WHERE   read_instance.id = 24;

--RESULT: Not much difference.
-----------------------------------------------------------