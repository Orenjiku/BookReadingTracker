/* change database name with {test} below */
\set my_db test
\c :my_db

/* Clears previous tables if they exist */
TRUNCATE TABLE reader, book, reader_book, book_read, read_entry, book_author, author CASCADE;

/* Declare reader information to INSERT INTO reader*/
\set username_1 'orenjiku'
\set first_name_1 'william'
\set last_name_1 'chang'
\set email_1 'wdchang86@gmail.com'

/* ----------------------------------------- INSERT READER -----------------------------------------*/
INSERT INTO reader (username, first_name, last_name, email) VALUES (:'username_1', :'first_name_1', :'last_name_1', :'email_1');

\set reader_1_id 1 --assumes reader has id 1

/* Declare book information to INSERT INTO book */
\set book_1_title 'the uriel ventris chronicles: volume two'
\set book_1_title_sort 'uriel ventris chronicles: volume two, the'
\set book_2_title 'the uriel ventris chronicles: volume one'
\set book_2_title_sort 'uriel ventris chronicles: volume one, the'
\set book_3_title 'cadian honour'
\set book_4_title 'maledictions: a horror anthology'
\set book_5_title 'cadia stands'
\set book_6_title 'honourbound'

/* ----------------------------------------- INSERT BOOKS -----------------------------------------*/
INSERT INTO book (
  title,
  title_sort,
  total_pages,
  book_description,
  picture_link
)
VALUES (
:'book_1_title',
:'book_1_title_sort',
848,
'The second omnibus of stories featuring one of Warhammer 40,000''s most prominent characters, Ultramarine Captain Uriel Ventris.

The Ultramarines are the epitome of a Space Marine Chapter. Warriors without peer, their name is a byword for discipline and honour, and their heroic deeds are legendary.

Captain Uriel Ventris fights to prove his worth and return to the hallowed ranks of the Chapter after his exile to the Eye of Terror. But as the Iron Warriors move against Ultramar, a grim premonition comes to light: Ventris will have a part to play in the coming war... for good or ill. The ongoing story of the Uriel Ventris continues in this omnibus edition, featuring the novels The Killing Ground, Courage and Honour and The Chapter''s Due, as well as several short stories and the classic comic ''Black Bone Road''.',
'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1561287919l/44180905.jpg'
);

INSERT INTO book (
  title,
  title_sort,
  total_pages,
  book_description,
  picture_link
)
VALUES (
:'book_2_title',
:'book_2_title_sort',
800,
'The Ultramarines are a byword for loyalty and courage, their martial prowess is legendary and is second only to the God-Emperor. Graham McNeill’s epic trilogy of Ultramarines novels is a masterpiece of non-stop action! Containing the novels Nightbringer, Warriors of Ultramar and Dead Sky, Black Sun, the series follows the adventures of Space Marine Captain Uriel Ventris and the Ultramarines as they battle against the enemies of mankind. From their home world of Macragge, into the dreaded Eye of Terror and beyond, Graham McNeill’s prose rattles like gunfire and brings the Space Marines to life like never before.',
'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1626758004l/58593308.jpg'
);

INSERT INTO book (
  title,
  title_sort,
  total_pages,
  book_description,
  picture_link
)
VALUES (
:'book_3_title',
:'book_3_title',
496,
'Sent to the capital world of Potence, Sergeant Minka Lesk and the Cadian 101st discover that though Cadia may have fallen, their duty continues.

For ten thousand years, Cadia stood as a bastion against the daemonic tide spewing forth from the Eye of Terror. But now the Fortress World lies in ruins, its armies decimated in the wake of Abaddon the Despoiler and his Thirteenth Black Crusade. Those who survived, though haunted by the loss of their beloved homeworld, remain bloodied and unbarred, fighting ruthlessly in the Emperor’s name.

Amongst them is the indomitable Sergeant Minka Lesk. Sent to the capital world of Potence, Lesk and the Cadian 101st company soon discover that a rot runs through the very heart of the seemingly peaceful world. Lesk knows she must excise this taint of Chaos, for it is not only her life and those of her company at stake, but also the honour of Cadia itself.',
'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1552227521l/44180913.jpg'
);

INSERT INTO book (
  title,
  title_sort,
  total_pages,
  book_description,
  picture_link
)
VALUES (
:'book_4_title',
:'book_4_title',
352,
'A eclectic collection of gut wrenching tales to spook and scare.

Horror is no stranger to the worlds of Warhammer. Its very fabric is infested with the arcane, the strange and the downright terrifying. From the cold, vastness of the 41st millenium to the creeping evil at large in the Mortal Realms, this anthology of short stories explores the sinister side of Warhammer in a way it never has been before. Psychological torment, visceral horrors, harrowing tales of the supernatural and the nightmares buried within, this collection brings together some of the best horror writing from the Black Library.

Featuring stories from Graham McNeill, Cassandra Khaw, Alec Worley, David Annandale and more.',
'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1548642309l/40744548.jpg'
);

INSERT INTO book (
  title,
  title_sort,
  total_pages,
  book_description,
  picture_link
)
VALUES (
:'book_5_title',
:'book_5_title',
320,
'The brutal war for Cadia is decided, as Lord Castellan Ursarkar Creed and the armies of the Imperium fight to halt the Thirteenth Black Crusade and prevent a calamity on a galactic scale.

Under almost constant besiegement by the daemonic hosts pouring from the Eye of Terror, Cadia stands as a bulwark against tyranny and death. Its fortresses and armies have held back the hordes of Chaos for centuries, but that grim defiance is about to reach its end. As Abaddon’s Thirteenth Black Crusade batters Cadia’s defences and the armies of the Imperium flock to reinforce this crucial world, a terrible ritual long in the making comes to fruition, and the delicate balance of this brutal war shifts… From the darkness, a hero rises to lead the beleaguered defenders, Lord Castellan Ursarkar Creed, but even with the armoured might of the Astra Militarum and the strength of the Adeptus Astartes at his side, it may not be enough to avert disaster and prevent the fall of Cadia. While Creed lives, there is hope. While there is breath in the body of a single defender, Cadia Stands… but for how much longer?',
  'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1497083669l/35297654._SY475_.jpg'
);

INSERT INTO book (
  title,
  title_sort,
  total_pages,
  book_description,
  picture_link
)
VALUES (
:'book_6_title',
:'book_6_title',
496,
'Uncompromising and fierce, Commissar Severina Raine has always served the Imperium with the utmost distinction. Attached to the Eleventh Antari Rifles, she instills order and courage in the face of utter horror. The Chaos cult, the Sighted, have swept throughout the Bale Stars and a shadow has fallen across its benighted worlds. A great campaign led by the vaunted hero Lord-General Militant Alar Serek is underway to free the system from tyranny and enslavement but the price of victory must be paid in blood. But what secrets do the Sighted harbour, secrets that might cast a light onto Raine’s own troubled past? Only by embracing her duty and staying true to her belief in the Imperium and the commissar’s creed can she hope to survive this crucible, but even then will that be enough?',
'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1545477896l/42789259._SY475_.jpg'
);


/* Associates all ids in TABLE book to reader id */
INSERT INTO reader_book (reader_id, book_id)
  SELECT :reader_1_id, book.id
  FROM book;

/* Creates a row for each book of the reader */
INSERT INTO book_read (reader_book_id)
  SELECT reader_book.id
  FROM reader_book
  WHERE reader_book.reader_id=:reader_1_id;

/* Update book where is_reading = TRUE */
CREATE OR REPLACE FUNCTION update_book_is_reading(arg_reader_id INT, arg_book_title VARCHAR)
RETURNS VOID AS $$
BEGIN
  UPDATE book_read
    SET is_reading=TRUE
      WHERE book_read.id=(
        SELECT id
        FROM reader_book AS r
        WHERE r.reader_id=$1 AND r.book_id=(
          SELECT id
          FROM book AS b
          WHERE b.title=$2
        )
      );
END $$ LANGUAGE plpgsql;

SELECT update_book_is_reading(:reader_1_id, :'book_1_title');

/* ----------------------------------------- FIND book_read_id FROM book_title -----------------------------------------*/
CREATE OR REPLACE FUNCTION get_book_read_id(arg_book_title VARCHAR)
RETURNS INT AS $$
BEGIN
  RETURN (SELECT id FROM book WHERE title=$1);
END $$ LANGUAGE plpgsql;

/* ----------------------------------------- INSERT READ_ENTRY -----------------------------------------*/
CREATE OR REPLACE FUNCTION insert_read_entry(
  arg_date_rate TIMESTAMP,
  arg_page_completed INT,
  arg_percentage_complated DECIMAL,
  arg_book_title VARCHAR
)
RETURNS VOID AS $$
DECLARE
  var_book_read_id INT = get_book_read_id(arg_book_title);
BEGIN
  INSERT INTO read_entry (date_read, page_completed, percentage_completed, book_read_id)
  VALUES ($1, $2, $3, var_book_read_id);
END $$ LANGUAGE plpgsql;

SELECT insert_read_entry('2021-07-27', 495, 58.37, :'book_1_title');
SELECT insert_read_entry('2021-07-26', 447, 52.71, :'book_1_title');
SELECT insert_read_entry('2021-07-25', 401, 47.29, :'book_1_title');
SELECT insert_read_entry('2021-07-24', 359, 42.33, :'book_1_title');
SELECT insert_read_entry('2021-07-23', 301, 35.5, :'book_1_title');
SELECT insert_read_entry('2021-07-22', 243, 28.66, :'book_1_title');
SELECT insert_read_entry('2021-07-21', 165, 19.46, :'book_1_title');
SELECT insert_read_entry('2021-07-20', 51, 6.01, :'book_1_title');

SELECT insert_read_entry('2021-07-19', 800, 100, :'book_2_title');
SELECT insert_read_entry('2021-07-19', 709, 88.63, :'book_2_title');
SELECT insert_read_entry('2021-07-18', 607, 75.88, :'book_2_title');
SELECT insert_read_entry('2021-07-17', 537, 67.13, :'book_2_title');
SELECT insert_read_entry('2021-07-16', 395, 49.38, :'book_2_title');
SELECT insert_read_entry('2021-07-15', 297, 37.13, :'book_2_title');
SELECT insert_read_entry('2021-07-14', 161, 20.13, :'book_2_title');
SELECT insert_read_entry('2021-07-13', 101, 12.63, :'book_2_title');
SELECT insert_read_entry('2021-07-12', 53, 6.63, :'book_2_title');
SELECT insert_read_entry('2021-07-12', 0, 0, :'book_2_title');

SELECT insert_read_entry('2021-07-11', 496, 100, :'book_3_title');
SELECT insert_read_entry('2021-07-10', 99, 19.96, :'book_3_title');
SELECT insert_read_entry('2021-07-10', 0, 0, :'book_3_title');

SELECT insert_read_entry('2021-07-10', 352, 100, :'book_4_title');
SELECT insert_read_entry('2021-07-09', 283, 80.4, :'book_4_title');
SELECT insert_read_entry('2021-07-08', 131, 37.22, :'book_4_title');
SELECT insert_read_entry('2021-07-07', 81, 23.01, :'book_4_title');
SELECT insert_read_entry('2021-07-07', 0, 0, :'book_4_title');

SELECT insert_read_entry('2021-07-06', 320, 100, :'book_5_title');
SELECT insert_read_entry('2021-07-05', 115, 35.94, :'book_5_title');
SELECT insert_read_entry('2021-07-05', 0, 0, :'book_5_title');

SELECT insert_read_entry('2021-07-04', 496, 100, :'book_6_title');
SELECT insert_read_entry('2021-07-03', 405, 81.65, :'book_6_title');
SELECT insert_read_entry('2021-07-02', 313, 63.1, :'book_6_title');
SELECT insert_read_entry('2021-07-01', 209, 42.14, :'book_6_title');
SELECT insert_read_entry('2021-06-30', 117, 23.59, :'book_6_title');
SELECT insert_read_entry('2021-06-30', 0, 0, :'book_6_title');

-- /* ----------------------------------------- INSERT AUTHOR -----------------------------------------*/
-- CREATE OR REPLACE FUNCTION insert_author(arg_full_name VARCHAR, arg_first_name VARCHAR, arg_last_name VARCHAR, arg_middle_name VARCHAR DEFAULT NULL)
-- RETURNS VOID AS $$
-- BEGIN
--   INSERT INTO
--     author (full_name, first_name, last_name, middle_name)
--   VALUES
--     ($1, $2, $3, $4)
--   ON CONFLICT (full_name)
--     DO NOTHING;
-- END $$ LANGUAGE plpgsql;

-- \set book_1_author_1_first_name 'Graham'
-- \set book_1_author_1_last_name 'McNeill'
-- \set book_1_author_1_full_name 'Graham McNeill'

-- \set book_2_author_1_first_name 'Graham'
-- \set book_2_author_1_last_name 'McNeill'
-- \set book_2_author_1_full_name 'Graham McNeill'

-- \set book_3_author_1_first_name 'Justin'
-- \set book_3_author_1_middle_name 'D.'
-- \set book_3_author_1_last_name 'Hill'
-- \set book_3_author_1_full_name 'Justin D. Hill'

-- \set book_4_author_1_first_name 'Cassandra'
-- \set book_4_author_1_last_name 'Khaw'
-- \set book_4_author_1_full_name 'Cassandra Khaw'
-- \set book_4_author_2_first_name 'Richard'
-- \set book_4_author_2_last_name 'Strachan'
-- \set book_4_author_2_full_name 'Richard Strachan'
-- \set book_4_author_3_first_name 'Graham'
-- \set book_4_author_3_last_name 'McNeill'
-- \set book_4_author_3_full_name 'Graham McNeill'
-- \set book_4_author_4_first_name 'Lora'
-- \set book_4_author_4_last_name 'Gray'
-- \set book_4_author_4_full_name 'Lora Gray'
-- \set book_4_author_5_first_name 'C'
-- \set book_4_author_5_middle_name 'L'
-- \set book_4_author_5_last_name 'Werner'
-- \set book_4_author_5_full_name 'C L Werner'
-- \set book_4_author_6_first_name 'Peter'
-- \set book_4_author_6_last_name 'McLean'
-- \set book_4_author_6_full_name 'Peter McLean'
-- \set book_4_author_7_first_name 'David'
-- \set book_4_author_7_last_name 'Annandale'
-- \set book_4_author_7_full_name 'David Annandale'
-- \set book_4_author_8_first_name 'Paul'
-- \set book_4_author_8_last_name 'Kane'
-- \set book_4_author_8_full_name 'Paul Kane'
-- \set book_4_author_9_first_name 'Josh'
-- \set book_4_author_9_last_name 'Reynolds'
-- \set book_4_author_9_full_name 'Josh Reynolds'
-- \set book_4_author_10_first_name 'J.C.'
-- \set book_4_author_10_last_name 'Stearns'
-- \set book_4_author_10_full_name 'J.C. Stearns'
-- \set book_4_author_11_first_name 'Alec'
-- \set book_4_author_11_last_name 'Worley'
-- \set book_4_author_11_full_name 'Alec Worley'

-- \set book_5_author_1_first_name 'Justin'
-- \set book_5_author_1_middle_name 'D.'
-- \set book_5_author_1_last_name 'Hill'
-- \set book_5_author_1_full_name 'Justin D. Hill'

-- \set book_6_author_1_first_name 'Rachel'
-- \set book_6_author_1_middle_name 'D.'
-- \set book_6_author_1_last_name 'Harrison'
-- \set book_6_author_1_full_name 'Rachel D. Harrison'

-- SELECT insert_author(:'book_1_author_1_full_name', :'book_1_author_1_first_name', :'book_1_author_1_last_name');

-- SELECT insert_author(:'book_2_author_1_full_name', :'book_2_author_1_first_name', :'book_2_author_1_last_name');

-- SELECT insert_author(:'book_3_author_1_full_name', :'book_3_author_1_first_name', :'book_3_author_1_last_name', :'book_3_author_1_middle_name');

-- SELECT insert_author(:'book_4_author_1_full_name', :'book_4_author_1_first_name', :'book_4_author_1_last_name');
-- SELECT insert_author(:'book_4_author_2_full_name', :'book_4_author_2_first_name', :'book_4_author_2_last_name');
-- SELECT insert_author(:'book_4_author_3_full_name', :'book_4_author_3_first_name', :'book_4_author_3_last_name');
-- SELECT insert_author(:'book_4_author_4_full_name', :'book_4_author_4_first_name', :'book_4_author_4_last_name');
-- SELECT insert_author(:'book_4_author_5_full_name', :'book_4_author_5_first_name', :'book_4_author_5_last_name', :'book_4_author_5_middle_name');
-- SELECT insert_author(:'book_4_author_6_full_name', :'book_4_author_6_first_name', :'book_4_author_6_last_name');
-- SELECT insert_author(:'book_4_author_7_full_name', :'book_4_author_7_first_name', :'book_4_author_7_last_name');
-- SELECT insert_author(:'book_4_author_8_full_name', :'book_4_author_8_first_name', :'book_4_author_8_last_name');
-- SELECT insert_author(:'book_4_author_9_full_name', :'book_4_author_9_first_name', :'book_4_author_9_last_name');
-- SELECT insert_author(:'book_4_author_10_full_name', :'book_4_author_10_first_name', :'book_4_author_10_last_name');
-- SELECT insert_author(:'book_4_author_11_full_name', :'book_4_author_11_first_name', :'book_4_author_11_last_name');

-- SELECT insert_author(:'book_5_author_1_full_name', :'book_5_author_1_first_name', :'book_5_author_1_last_name', :'book_5_author_1_middle_name');

-- SELECT insert_author(:'book_6_author_1_full_name', :'book_6_author_1_first_name', :'book_6_author_1_last_name', :'book_6_author_1_middle_name');

-- /* ----------------------------------------- INSERT JOIN TABLE BOOK_AUTHOR -----------------------------------------*/
-- CREATE OR REPLACE FUNCTION join_book_author(
--   arg_book_id INT,
--   arg_author_full_name VARCHAR
-- )
-- RETURNS VOID AS $$
-- BEGIN
--   INSERT INTO book_author (book_id, author_id)
--   SELECT $1, author.id
--   FROM author
--   WHERE author.id=(
--     SELECT id
--     FROM author AS a
--     WHERE a.full_name=$2
--   );
-- END $$ LANGUAGE plpgsql;

-- SELECT join_book_author(:book_1_id, :'book_1_author_1_full_name');

-- SELECT join_book_author(:book_2_id, :'book_2_author_1_full_name');

-- SELECT join_book_author(:book_3_id, :'book_3_author_1_full_name');

-- SELECT join_book_author(:book_4_id, :'book_4_author_1_full_name');
-- SELECT join_book_author(:book_4_id, :'book_4_author_2_full_name');
-- SELECT join_book_author(:book_4_id, :'book_4_author_3_full_name');
-- SELECT join_book_author(:book_4_id, :'book_4_author_4_full_name');
-- SELECT join_book_author(:book_4_id, :'book_4_author_5_full_name');
-- SELECT join_book_author(:book_4_id, :'book_4_author_6_full_name');
-- SELECT join_book_author(:book_4_id, :'book_4_author_7_full_name');
-- SELECT join_book_author(:book_4_id, :'book_4_author_8_full_name');
-- SELECT join_book_author(:book_4_id, :'book_4_author_9_full_name');
-- SELECT join_book_author(:book_4_id, :'book_4_author_10_full_name');
-- SELECT join_book_author(:book_4_id, :'book_4_author_11_full_name');

-- SELECT join_book_author(:book_5_id, :'book_5_author_1_full_name');

-- SELECT join_book_author(:book_6_id, :'book_6_author_1_full_name');