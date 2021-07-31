/* ----------------------------------------- USE DATABASE my_db ----------------------------------------- */
\set my_db test
\c :my_db

/* ----------------------------------------- CLEAR EXISTING TABLES ----------------------------------------- */
TRUNCATE TABLE reader, book, reader_book, book_read, read_entry, book_author, author CASCADE;

/* ----------------------------------------- INSERT READER ----------------------------------------- */
-- FUNCTION insert_reader
CREATE OR REPLACE FUNCTION insert_reader(arg_username VARCHAR, arg_first_name VARCHAR, arg_last_name VARCHAR, email VARCHAR)
RETURNS VOID AS $$
BEGIN
  INSERT INTO reader (username, first_name, last_name, email)
  VALUES ($1, $2, $3, $4);
END $$ LANGUAGE plpgsql;

-- DECLARE reader information
\set username_1 'orenjiku'
\set first_name_1 'william'
\set last_name_1 'chang'
\set email_1 'wdchang86@gmail.com'

-- INSERT data using FUNCTION insert_reader and DECLARED reader variables as arguments
SELECT insert_reader(:'username_1', :'first_name_1', :'last_name_1', :'email_1');


/* ----------------------------------------- INSERT BOOKS ----------------------------------------- */
-- FUNCTION insert_book
CREATE OR REPLACE FUNCTION insert_book(
  arg_title VARCHAR,
  arg_title_sort VARCHAR,
  arg_total_pages INT,
  arg_book_description TEXT,
  arg_picture_link VARCHAR
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO book (title, title_sort, total_pages, book_description, picture_link)
  VALUES ($1, $2, $3, $4, $5);
END $$ LANGUAGE plpgsql;

-- DECLARE book information
\set book_1_title 'xenos'
\set book_1_title_sort 'xenos'
\set book_1_total_pages 416
\set book_1_book_description 'The Inquisition moves amongst mankind like an avenging shadow, striking down the enemies of humanity with uncompromising ruthlessness. When he finally corners an old foe, Inquisitor Gregor Eisenhorn is drawn into a sinister conspiracy. As events unfold and he gathers allies – and enemies – Eisenhorn faces a vast interstellar cabal and the dark power of daemons, all racing to recover an arcane text of abominable power: an ancient tome known as the Necroteuch.'
\set book_1_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1424053669l/23492371.jpg'

\set book_2_title 'malleus'
\set book_2_title_sort 'malleus'
\set book_2_total_pages 416
\set book_2_book_description 'Part two of the epic Eisenhorn trilogy returns.\\n\\nA century after his recovery of the alien Necroteuch, Gregor Eisenhorn is one of the Imperial Inquisition’s most celebrated agents. But when a face from his past returns to haunt him, and he is implicated in a great tragedy that devastates the world of Thracian Primaris, Eisenhorn’s universe crumbles around him. The daemon Cherubael is back, and seeks to bring the inquisitor to ruin – either by his death, or by turning him to the service of the Dark Gods.'
\set book_2_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1427161165l/23492350.jpg'

\set book_3_title 'hereticus'
\set book_3_title_sort'hereticus'
\set book_3_total_pages 416
\set book_3_book_description 'Part three of the epic Eisenhorn trilogy returns.\\n\\nHunted by his former allies as a radical and enemy of the Imperium, Inquisitor Gregor Eisenhorn must fight to prove that he remains loyal as he tracks down a dangerous heretic whom the Inquisition believes dead – the dread former Inquisitor Quixos. As he grows more desperate for victory, Eisenhorn uses ever darker means to achieve his goals – but how far can he go using the weapons of the enemy until he becomes that very enemy – and no different to the traitor he hunts?'
\set book_3_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1430084067l/23492348.jpg'

\set book_4_title 'ravenor: the omnibus'
\set book_4_title_sort 'ravenor: the omnibus'
\set book_4_total_pages 880
\set book_4_book_description 'Inquisitor Ravenor and his followers investigate a daemonic conspiracy that stretches across space and time in three classic novels by Dan Abnett.\\n\\nIn the war-torn future of the 41st millennium, the Inquisition fights a secret war against the darkest enemies of mankind – the alien, the heretic and the daemon. The three stories in this omnibus tell the tale of Inquisitor Gideon Ravenor and his lethal band of operatives, whose investigations take them from the heart of the Scarus Sector to the wildest regions of space beyond, and even through time itself. Wherever they go, and whatever dangers they face, they will never give up until their mission succeeds.\\n\\nContains the novels Ravenor, Ravenor Returned and Ravenor Regue, plus three short stories.'
\set book_4_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1545478110l/42641133._SY475_.jpg'

\set book_5_title 'the magos'
\set book_5_title_sort 'the magos'
\set book_5_total_pages 720
\set book_5_book_description 'Inquisitor Eisenhorn returns in a stunning new novel that pits him against his oldest foe, forcing him to finally confront the growing darkness within his own soul.\\n\\nInquisitor Gregor Eisenhorn has spent his life stalking the darkest and most dangerous corners of the galaxy in pursuit of heresy and Chaos, but how long can a man walk that path without succumbing to the lure of the warp? Pursuing heretics in the remote worlds of the Imperium, Eisenhorn must confront the truth about himself. Is he still a champion of the Throne? Or has he been seduced by the very evil that he hunts? The Magos is the brand new, full-length fourth novel in the hugely popular Eisenhorn series. This paperback edition also includes the definitive casebook of Gregor Eisenhorn, collecting together all twelve of Dan Abnett’s Inquisition short stories, several of which have never been in print before. These additional stories have been compiled by the author to act as an essential prologue to this long-awaited new novel, while also serving as an indispensable companion to the original Eisenhorn trilogy.'
\set book_5_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1506373817l/36304173._SY475_.jpg'

\set book_6_title 'honourbound'
\set book_6_title_sort 'honourbound'
\set book_6_total_pages 496
\set book_6_book_description 'Uncompromising and fierce, Commissar Severina Raine has always served the Imperium with the utmost distinction. Attached to the Eleventh Antari Rifles, she instills order and courage in the face of utter horror. The Chaos cult, the Sighted, have swept throughout the Bale Stars and a shadow has fallen across its benighted worlds. A great campaign led by the vaunted hero Lord-General Militant Alar Serek is underway to free the system from tyranny and enslavement but the price of victory must be paid in blood. But what secrets do the Sighted harbour, secrets that might cast a light onto Raine’s own troubled past? Only by embracing her duty and staying true to her belief in the Imperium and the commissar’s creed can she hope to survive this crucible, but even then will that be enough?'
\set book_6_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1545477896l/42789259._SY475_.jpg'

\set book_7_title 'cadia stands'
\set book_7_title_sort 'cadia stands'
\set book_7_total_pages 320
\set book_7_book_description 'The brutal war for Cadia is decided, as Lord Castellan Ursarkar Creed and the armies of the Imperium fight to halt the Thirteenth Black Crusade and prevent a calamity on a galactic scale.\\n\\nUnder almost constant besiegement by the daemonic hosts pouring from the Eye of Terror, Cadia stands as a bulwark against tyranny and death. Its fortresses and armies have held back the hordes of Chaos for centuries, but that grim defiance is about to reach its end. As Abaddon’s Thirteenth Black Crusade batters Cadia’s defences and the armies of the Imperium flock to reinforce this crucial world, a terrible ritual long in the making comes to fruition, and the delicate balance of this brutal war shifts… From the darkness, a hero rises to lead the beleaguered defenders, Lord Castellan Ursarkar Creed, but even with the armoured might of the Astra Militarum and the strength of the Adeptus Astartes at his side, it may not be enough to avert disaster and prevent the fall of Cadia. While Creed lives, there is hope. While there is breath in the body of a single defender, Cadia Stands… but for how much longer?'
\set book_7_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1497083669l/35297654._SY475_.jpg'

\set book_8_title 'maledictions: a horror anthology'
\set book_8_title_sort 'maledictions: a horror anthology'
\set book_8_total_pages 352
\set book_8_book_description 'A eclectic collection of gut wrenching tales to spook and scare.\\n\\nHorror is no stranger to the worlds of Warhammer. Its very fabric is infested with the arcane, the strange and the downright terrifying. From the cold, vastness of the 41st millenium to the creeping evil at large in the Mortal Realms, this anthology of short stories explores the sinister side of Warhammer in a way it never has been before. Psychological torment, visceral horrors, harrowing tales of the supernatural and the nightmares buried within, this collection brings together some of the best horror writing from the Black Library.\\n\\nFeaturing stories from Graham McNeill, Cassandra Khaw, Alec Worley, David Annandale and more.'
\set book_8_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1548642309l/40744548.jpg'

\set book_9_title 'cadian honour'
\set book_9_title_sort 'cadian honour'
\set book_9_total_pages 496
\set book_9_book_description 'Sent to the capital world of Potence, Sergeant Minka Lesk and the Cadian 101st discover that though Cadia may have fallen, their duty continues.\\n\\nFor ten thousand years, Cadia stood as a bastion against the daemonic tide spewing forth from the Eye of Terror. But now the Fortress World lies in ruins, its armies decimated in the wake of Abaddon the Despoiler and his Thirteenth Black Crusade. Those who survived, though haunted by the loss of their beloved homeworld, remain bloodied and unbarred, fighting ruthlessly in the Emperor’s name.\\n\\nAmongst them is the indomitable Sergeant Minka Lesk. Sent to the capital world of Potence, Lesk and the Cadian 101st company soon discover that a rot runs through the very heart of the seemingly peaceful world. Lesk knows she must excise this taint of Chaos, for it is not only her life and those of her company at stake, but also the honour of Cadia itself.'
\set book_9_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1552227521l/44180913.jpg'

\set book_10_title 'the uriel ventris chronicles: volume one'
\set book_10_title_sort 'uriel ventris chronicles: volume one, the'
\set book_10_total_pages 800
\set book_10_book_description 'The Ultramarines are a byword for loyalty and courage, their martial prowess is legendary and is second only to the God-Emperor. Graham McNeill’s epic trilogy of Ultramarines novels is a masterpiece of non-stop action! Containing the novels Nightbringer, Warriors of Ultramar and Dead Sky, Black Sun, the series follows the adventures of Space Marine Captain Uriel Ventris and the Ultramarines as they battle against the enemies of mankind. From their home world of Macragge, into the dreaded Eye of Terror and beyond, Graham McNeill’s prose rattles like gunfire and brings the Space Marines to life like never before.'
\set book_10_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1626758004l/58593308.jpg'

\set book_11_title 'the uriel ventris chronicles: volume two'
\set book_11_title_sort 'uriel ventris chronicles: volume two, the'
\set book_11_total_pages 848
\set book_11_book_description 'The second omnibus of stories featuring one of Warhammer 40,000''s most prominent characters, Ultramarine Captain Uriel Ventris.\\n\\nThe Ultramarines are the epitome of a Space Marine Chapter. Warriors without peer, their name is a byword for discipline and honour, and their heroic deeds are legendary.\\n\\nCaptain Uriel Ventris fights to prove his worth and return to the hallowed ranks of the Chapter after his exile to the Eye of Terror. But as the Iron Warriors move against Ultramar, a grim premonition comes to light: Ventris will have a part to play in the coming war... for good or ill. The ongoing story of the Uriel Ventris continues in this omnibus edition, featuring the novels The Killing Ground, Courage and Honour and The Chapter''s Due, as well as several short stories and the classic comic ''Black Bone Road''.'
\set book_11_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1561287919l/44180905.jpg'

-- INSERT data using FUNCTION insert_book and DECLARED book variables as arguments
SELECT insert_book(:'book_1_title', :'book_1_title_sort', :'book_1_total_pages', :'book_1_book_description', :'book_1_picture_link');
SELECT insert_book(:'book_2_title', :'book_2_title_sort', :'book_2_total_pages', :'book_2_book_description', :'book_2_picture_link');
SELECT insert_book(:'book_3_title', :'book_3_title_sort', :'book_3_total_pages', :'book_3_book_description', :'book_3_picture_link');
SELECT insert_book(:'book_4_title', :'book_4_title_sort', :'book_4_total_pages', :'book_4_book_description', :'book_4_picture_link');
SELECT insert_book(:'book_5_title', :'book_5_title_sort', :'book_5_total_pages', :'book_5_book_description', :'book_5_picture_link');
SELECT insert_book(:'book_6_title', :'book_6_title_sort', :'book_6_total_pages', :'book_6_book_description', :'book_6_picture_link');
SELECT insert_book(:'book_7_title', :'book_7_title_sort', :'book_7_total_pages', :'book_7_book_description', :'book_7_picture_link');
SELECT insert_book(:'book_8_title', :'book_8_title_sort', :'book_8_total_pages', :'book_8_book_description', :'book_8_picture_link');
SELECT insert_book(:'book_9_title', :'book_9_title_sort', :'book_9_total_pages', :'book_9_book_description', :'book_9_picture_link');
SELECT insert_book(:'book_10_title', :'book_10_title_sort', :'book_10_total_pages', :'book_10_book_description', :'book_10_picture_link');
SELECT insert_book(:'book_11_title', :'book_11_title_sort', :'book_11_total_pages', :'book_11_book_description', :'book_11_picture_link');


/* ----------------------------------------- INSERT JOIN reader_book ----------------------------------------- */
-- FUNCTION get_reader_id
CREATE OR REPLACE FUNCTION get_reader_id(arg_username VARCHAR)
RETURNS INT AS $$
BEGIN
  RETURN (SELECT reader.id FROM reader WHERE reader.username=$1);
END $$ LANGUAGE plpgsql;

-- FUNCTION get_book_id
CREATE OR REPLACE FUNCTION get_book_id(arg_book_title VARCHAR)
RETURNS INT AS $$
BEGIN
  RETURN (SELECT id FROM book WHERE title=$1);
END $$ LANGUAGE plpgsql;

-- FUNCTION join_reader_book
CREATE OR REPLACE FUNCTION join_reader_book(arg_username VARCHAR, arg_book_title VARCHAR)
RETURNS VOID AS $$
DECLARE
  var_reader_id INT = get_reader_id($1);
  var_book_id INT = get_book_id($2);
BEGIN
  INSERT INTO reader_book (reader_id, book_id)
  VALUES (var_reader_id, var_book_id);
END $$ LANGUAGE plpgsql;

-- INSERT relationship between reader and book
SELECT join_reader_book(:'username_1', :'book_1_title');
SELECT join_reader_book(:'username_1', :'book_2_title');
SELECT join_reader_book(:'username_1', :'book_3_title');
SELECT join_reader_book(:'username_1', :'book_4_title');
SELECT join_reader_book(:'username_1', :'book_5_title');
SELECT join_reader_book(:'username_1', :'book_6_title');
SELECT join_reader_book(:'username_1', :'book_7_title');
SELECT join_reader_book(:'username_1', :'book_8_title');
SELECT join_reader_book(:'username_1', :'book_9_title');
SELECT join_reader_book(:'username_1', :'book_10_title');
SELECT join_reader_book(:'username_1', :'book_11_title');


/* ----------------------------------------- INSERT book_read ----------------------------------------- */
-- FUNCTION get_reader_book_id
CREATE OR REPLACE FUNCTION get_reader_book_id(arg_username VARCHAR, arg_book_title VARCHAR)
RETURNS INT AS $$
BEGIN
  RETURN (
    SELECT r.id FROM reader_book AS r
    WHERE r.reader_id=(SELECT get_reader_id($1))
    AND r.book_id=(SELECT get_book_id($2))
  );
END $$ LANGUAGE plpgsql;

-- FUNCTION insert_book_read
CREATE OR REPLACE FUNCTION insert_book_read(arg_username VARCHAR, arg_book_title VARCHAR)
RETURNS VOID AS $$
DECLARE
  var_reader_book_id INT = get_reader_book_id($1, $2);
BEGIN
  INSERT INTO book_read (reader_book_id)
  VALUES (var_reader_book_id);
END $$ LANGUAGE plpgsql;

-- INSERT relational data to match read data with a user and a book
SELECT insert_book_read(:'username_1', :'book_1_title');
SELECT insert_book_read(:'username_1', :'book_2_title');
SELECT insert_book_read(:'username_1', :'book_3_title');
SELECT insert_book_read(:'username_1', :'book_4_title');
SELECT insert_book_read(:'username_1', :'book_5_title');
SELECT insert_book_read(:'username_1', :'book_6_title');
SELECT insert_book_read(:'username_1', :'book_7_title');
SELECT insert_book_read(:'username_1', :'book_8_title');
SELECT insert_book_read(:'username_1', :'book_9_title');
SELECT insert_book_read(:'username_1', :'book_10_title');
SELECT insert_book_read(:'username_1', :'book_11_title');


/* ----------------------------------------- UPDATE book_read_is_reading ----------------------------------------- */
-- UPDATE book_read so is_reading = TRUE */
CREATE OR REPLACE FUNCTION update_book_read_is_reading(arg_username VARCHAR, arg_book_title VARCHAR)
RETURNS VOID AS $$
DECLARE
  var_reader_id INT = get_reader_id($1);
  var_book_id INT = get_book_id($2);
BEGIN
  UPDATE book_read
  SET is_reading=TRUE
    WHERE book_read.id=(
      SELECT id
      FROM reader_book AS r
      WHERE r.reader_id=var_reader_id AND r.book_id=var_book_id
    );
END $$ LANGUAGE plpgsql;

SELECT update_book_read_is_reading(:'username_1', :'book_1_title');


/* ----------------------------------------- INSERT READ_ENTRY -----------------------------------------*/
-- FUNCTION get_book_read_id
CREATE OR REPLACE FUNCTION get_book_read_id(arg_book_title VARCHAR)
RETURNS INT AS $$
BEGIN
  RETURN (SELECT id FROM book WHERE title=$1);
END $$ LANGUAGE plpgsql;

-- FUNCTION insert_read_entry
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

-- INSERT read_entry data\
SELECT insert_read_entry('2021-05-29', 0, 0, :'book_1_title');
SELECT insert_read_entry('2021-05-29', 69, 16.59, :'book_1_title');
SELECT insert_read_entry('2021-05-30', 191, 45.91, :'book_1_title');
SELECT insert_read_entry('2021-05-31', 249, 59.86, :'book_1_title');
SELECT insert_read_entry('2021-06-01', 353, 84.86, :'book_1_title');
SELECT insert_read_entry('2021-06-02', 416, 100, :'book_1_title');

SELECT insert_read_entry('2021-06-02', 0, 0, :'book_2_title');
SELECT insert_read_entry('2021-06-02', 41, 9.86, :'book_2_title');
SELECT insert_read_entry('2021-06-03', 71, 17.07, :'book_2_title');
SELECT insert_read_entry('2021-06-04', 107, 25.72, :'book_2_title');
SELECT insert_read_entry('2021-06-05', 177, 42.55, :'book_2_title');
SELECT insert_read_entry('2021-06-06', 357, 54.09, :'book_2_title');
SELECT insert_read_entry('2021-06-07', 416, 100, :'book_2_title');

SELECT insert_read_entry('2021-06-07', 0, 0, :'book_3_title');
SELECT insert_read_entry('2021-06-07', 43, 10.34, :'book_3_title');
SELECT insert_read_entry('2021-06-08', 97, 23.32, :'book_3_title');
SELECT insert_read_entry('2021-06-09', 177, 42.55, :'book_3_title');
SELECT insert_read_entry('2021-06-10', 225, 54.09, :'book_3_title');
SELECT insert_read_entry('2021-06-11', 267, 64.18, :'book_3_title');
SELECT insert_read_entry('2021-06-12', 416, 100, :'book_3_title');

SELECT insert_read_entry('2021-06-13', 0, 0, :'book_4_title');
SELECT insert_read_entry('2021-06-13', 78, 8.86, :'book_4_title');
SELECT insert_read_entry('2021-06-14', 116, 13.18, :'book_4_title');
SELECT insert_read_entry('2021-06-16', 153, 17.39, :'book_4_title');
SELECT insert_read_entry('2021-06-19', 251, 28.52, :'book_4_title');
SELECT insert_read_entry('2021-06-20', 272, 30.91, :'book_4_title');
SELECT insert_read_entry('2021-06-21', 324, 36.82, :'book_4_title');
SELECT insert_read_entry('2021-06-22', 375, 42.61, :'book_4_title');
SELECT insert_read_entry('2021-06-23', 403, 45.8, :'book_4_title');
SELECT insert_read_entry('2021-06-24', 528, 60, :'book_4_title');
SELECT insert_read_entry('2021-06-25', 667, 76.93, :'book_4_title');
SELECT insert_read_entry('2021-06-26', 880, 100, :'book_4_title');

SELECT insert_read_entry('2021-06-26', 0, 0, :'book_5_title');
SELECT insert_read_entry('2021-06-27', 210, 29.17, :'book_5_title');
SELECT insert_read_entry('2021-06-28', 312, 43.33, :'book_5_title');
SELECT insert_read_entry('2021-06-29', 651, 90.42, :'book_5_title');
SELECT insert_read_entry('2021-06-29', 720, 100, :'book_5_title');

SELECT insert_read_entry('2021-06-30', 0, 0, :'book_6_title');
SELECT insert_read_entry('2021-06-30', 117, 23.59, :'book_6_title');
SELECT insert_read_entry('2021-07-01', 209, 42.14, :'book_6_title');
SELECT insert_read_entry('2021-07-02', 313, 63.1, :'book_6_title');
SELECT insert_read_entry('2021-07-03', 405, 81.65, :'book_6_title');
SELECT insert_read_entry('2021-07-04', 496, 100, :'book_6_title');

SELECT insert_read_entry('2021-07-05', 0, 0, :'book_7_title');
SELECT insert_read_entry('2021-07-05', 115, 35.94, :'book_7_title');
SELECT insert_read_entry('2021-07-06', 320, 100, :'book_7_title');

SELECT insert_read_entry('2021-07-07', 0, 0, :'book_8_title');
SELECT insert_read_entry('2021-07-07', 81, 23.01, :'book_8_title');
SELECT insert_read_entry('2021-07-08', 131, 37.22, :'book_8_title');
SELECT insert_read_entry('2021-07-09', 283, 80.4, :'book_8_title');
SELECT insert_read_entry('2021-07-10', 352, 100, :'book_8_title');

SELECT insert_read_entry('2021-07-10', 0, 0, :'book_9_title');
SELECT insert_read_entry('2021-07-10', 99, 19.96, :'book_9_title');
SELECT insert_read_entry('2021-07-11', 496, 100, :'book_9_title');

SELECT insert_read_entry('2021-07-12', 0, 0, :'book_10_title');
SELECT insert_read_entry('2021-07-12', 53, 6.63, :'book_10_title');
SELECT insert_read_entry('2021-07-13', 101, 12.63, :'book_10_title');
SELECT insert_read_entry('2021-07-14', 161, 20.13, :'book_10_title');
SELECT insert_read_entry('2021-07-15', 297, 37.13, :'book_10_title');
SELECT insert_read_entry('2021-07-16', 395, 49.38, :'book_10_title');
SELECT insert_read_entry('2021-07-17', 537, 67.13, :'book_10_title');
SELECT insert_read_entry('2021-07-18', 607, 75.88, :'book_10_title');
SELECT insert_read_entry('2021-07-19', 709, 88.63, :'book_10_title');
SELECT insert_read_entry('2021-07-19', 800, 100, :'book_10_title');

SELECT insert_read_entry('2021-07-20', 0, 0, :'book_11_title');
SELECT insert_read_entry('2021-07-20', 51, 6.01, :'book_11_title');
SELECT insert_read_entry('2021-07-21', 165, 19.46, :'book_11_title');
SELECT insert_read_entry('2021-07-22', 243, 28.66, :'book_11_title');
SELECT insert_read_entry('2021-07-23', 301, 35.5, :'book_11_title');
SELECT insert_read_entry('2021-07-24', 359, 42.33, :'book_11_title');
SELECT insert_read_entry('2021-07-25', 401, 47.29, :'book_11_title');
SELECT insert_read_entry('2021-07-26', 447, 52.71, :'book_11_title');
SELECT insert_read_entry('2021-07-27', 495, 58.37, :'book_11_title');


/* ----------------------------------------- INSERT AUTHOR -----------------------------------------*/
-- FUNCTION insert_author
CREATE OR REPLACE FUNCTION insert_author(arg_full_name VARCHAR, arg_first_name VARCHAR, arg_last_name VARCHAR, arg_middle_name VARCHAR DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
  INSERT INTO
    author (full_name, first_name, last_name, middle_name)
  VALUES
    ($1, $2, $3, $4)
  ON CONFLICT (full_name)
    DO NOTHING;
END $$ LANGUAGE plpgsql;

-- DECLARE author information
-- book 1 author(s)
\set book_1_author_1_first_name 'Dan'
\set book_1_author_1_last_name 'Abnett'
\set book_1_author_1_full_name 'Dan Abnett'
-- book 2 author(s)
\set book_2_author_1_first_name 'Dan'
\set book_2_author_1_last_name 'Abnett'
\set book_2_author_1_full_name 'Dan Abnett'
-- book 3 author(s)
\set book_3_author_1_first_name 'Dan'
\set book_3_author_1_last_name 'Abnett'
\set book_3_author_1_full_name 'Dan Abnett'
-- book 4 author(s)
\set book_4_author_1_first_name 'Dan'
\set book_4_author_1_last_name 'Abnett'
\set book_4_author_1_full_name 'Dan Abnett'
-- book 5 author(s)
\set book_5_author_1_first_name 'Dan'
\set book_5_author_1_last_name 'Abnett'
\set book_5_author_1_full_name 'Dan Abnett'
-- book 6 author(s)
\set book_6_author_1_first_name 'Rachel'
\set book_6_author_1_middle_name 'D.'
\set book_6_author_1_last_name 'Harrison'
\set book_6_author_1_full_name 'Rachel D. Harrison'
-- book 7 author(s)
\set book_7_author_1_first_name 'Justin'
\set book_7_author_1_middle_name 'D.'
\set book_7_author_1_last_name 'Hill'
\set book_7_author_1_full_name 'Justin D. Hill'
-- book 8 author(s)
\set book_8_author_1_first_name 'Cassandra'
\set book_8_author_1_last_name 'Khaw'
\set book_8_author_1_full_name 'Cassandra Khaw'
\set book_8_author_2_first_name 'Richard'
\set book_8_author_2_last_name 'Strachan'
\set book_8_author_2_full_name 'Richard Strachan'
\set book_8_author_3_first_name 'Graham'
\set book_8_author_3_last_name 'McNeill'
\set book_8_author_3_full_name 'Graham McNeill'
\set book_8_author_4_first_name 'Lora'
\set book_8_author_4_last_name 'Gray'
\set book_8_author_4_full_name 'Lora Gray'
\set book_8_author_5_first_name 'C'
\set book_8_author_5_middle_name 'L'
\set book_8_author_5_last_name 'Werner'
\set book_8_author_5_full_name 'C L Werner'
\set book_8_author_6_first_name 'Peter'
\set book_8_author_6_last_name 'McLean'
\set book_8_author_6_full_name 'Peter McLean'
\set book_8_author_7_first_name 'David'
\set book_8_author_7_last_name 'Annandale'
\set book_8_author_7_full_name 'David Annandale'
\set book_8_author_8_first_name 'Paul'
\set book_8_author_8_last_name 'Kane'
\set book_8_author_8_full_name 'Paul Kane'
\set book_8_author_9_first_name 'Josh'
\set book_8_author_9_last_name 'Reynolds'
\set book_8_author_9_full_name 'Josh Reynolds'
\set book_8_author_10_first_name 'J.C.'
\set book_8_author_10_last_name 'Stearns'
\set book_8_author_10_full_name 'J.C. Stearns'
\set book_8_author_11_first_name 'Alec'
\set book_8_author_11_last_name 'Worley'
\set book_8_author_11_full_name 'Alec Worley'
-- book 9 author(s)
\set book_9_author_1_first_name 'Justin'
\set book_9_author_1_middle_name 'D.'
\set book_9_author_1_last_name 'Hill'
\set book_9_author_1_full_name 'Justin D. Hill'
-- book 10 author(s)
\set book_10_author_1_first_name 'Graham'
\set book_10_author_1_last_name 'McNeill'
\set book_10_author_1_full_name 'Graham McNeill'
-- book 11 author(s)
\set book_11_author_1_first_name 'Graham'
\set book_11_author_1_last_name 'McNeill'
\set book_11_author_1_full_name 'Graham McNeill'


-- INSERT author using FUNCTION insert_author and DECLARED author variables as arguments, CHECK UNIQUE full_name (middle_name argument is optional)
-- book 1 author(s)
SELECT insert_author(:'book_1_author_1_full_name', :'book_1_author_1_first_name', :'book_1_author_1_last_name');
-- book 2 author(s)
SELECT insert_author(:'book_2_author_1_full_name', :'book_2_author_1_first_name', :'book_2_author_1_last_name');
-- book 3 author(s)
SELECT insert_author(:'book_3_author_1_full_name', :'book_3_author_1_first_name', :'book_3_author_1_last_name');
-- book 4 author(s)
SELECT insert_author(:'book_4_author_1_full_name', :'book_4_author_1_first_name', :'book_4_author_1_last_name');
-- book 5 author(s)
SELECT insert_author(:'book_5_author_1_full_name', :'book_5_author_1_first_name', :'book_5_author_1_last_name');
-- book 6 author(s)
SELECT insert_author(:'book_6_author_1_full_name', :'book_6_author_1_first_name', :'book_6_author_1_last_name');
-- book 7 author(s)
SELECT insert_author(:'book_7_author_1_full_name', :'book_7_author_1_first_name', :'book_7_author_1_last_name', :'book_7_author_1_middle_name');
-- book 8 author(s)
SELECT insert_author(:'book_8_author_1_full_name', :'book_8_author_1_first_name', :'book_8_author_1_last_name');
SELECT insert_author(:'book_8_author_2_full_name', :'book_8_author_2_first_name', :'book_8_author_2_last_name');
SELECT insert_author(:'book_8_author_3_full_name', :'book_8_author_3_first_name', :'book_8_author_3_last_name');
SELECT insert_author(:'book_8_author_4_full_name', :'book_8_author_4_first_name', :'book_8_author_4_last_name');
SELECT insert_author(:'book_8_author_5_full_name', :'book_8_author_5_first_name', :'book_8_author_5_last_name', :'book_8_author_5_middle_name');
SELECT insert_author(:'book_8_author_6_full_name', :'book_8_author_6_first_name', :'book_8_author_6_last_name');
SELECT insert_author(:'book_8_author_7_full_name', :'book_8_author_7_first_name', :'book_8_author_7_last_name');
SELECT insert_author(:'book_8_author_8_full_name', :'book_8_author_8_first_name', :'book_8_author_8_last_name');
SELECT insert_author(:'book_8_author_9_full_name', :'book_8_author_9_first_name', :'book_8_author_9_last_name');
SELECT insert_author(:'book_8_author_10_full_name', :'book_8_author_10_first_name', :'book_8_author_10_last_name');
SELECT insert_author(:'book_8_author_11_full_name', :'book_8_author_11_first_name', :'book_8_author_11_last_name');
-- book 9 author(s)
SELECT insert_author(:'book_9_author_1_full_name', :'book_9_author_1_first_name', :'book_9_author_1_last_name', :'book_9_author_1_middle_name');
-- book 10 author(s)
SELECT insert_author(:'book_10_author_1_full_name', :'book_10_author_1_first_name', :'book_10_author_1_last_name');
-- book 11 author(s)
SELECT insert_author(:'book_11_author_1_full_name', :'book_11_author_1_first_name', :'book_11_author_1_last_name');


/* ----------------------------------------- INSERT JOIN TABLE BOOK_AUTHOR -----------------------------------------*/
-- FUNCTION get_author_id
CREATE OR REPLACE FUNCTION get_author_id(arg_author_full_name VARCHAR)
RETURNS INT AS $$
BEGIN
  RETURN (SELECT a.id FROM author AS a WHERE a.full_name=$1);
END $$ LANGUAGE plpgsql;

-- FUNCTION join_book_author
CREATE OR REPLACE FUNCTION join_book_author(arg_book_title VARCHAR, arg_author_full_name VARCHAR)
RETURNS VOID AS $$
DECLARE
  var_book_id INT = get_book_id($1);
  var_author_id INT = get_author_id($2);
BEGIN
  INSERT INTO book_author (book_id, author_id)
  VALUES (var_book_id, var_author_id);
END $$ LANGUAGE plpgsql;

-- INSERT relationship between book and author
-- book 1 author(s)
SELECT join_book_author(:'book_1_title', :'book_1_author_1_full_name');
-- book 2 author(s)
SELECT join_book_author(:'book_2_title', :'book_2_author_1_full_name');
-- book 3 author(s)
SELECT join_book_author(:'book_3_title', :'book_3_author_1_full_name');
-- book 4 author(s)
SELECT join_book_author(:'book_4_title', :'book_4_author_1_full_name');
-- book 5 author(s)
SELECT join_book_author(:'book_5_title', :'book_5_author_1_full_name');
-- book 6 author(s)
SELECT join_book_author(:'book_6_title', :'book_6_author_1_full_name');
-- book 7 author(s)
SELECT join_book_author(:'book_7_title', :'book_7_author_1_full_name');
-- book 8 author(s)
SELECT join_book_author(:'book_8_title', :'book_8_author_1_full_name');
SELECT join_book_author(:'book_8_title', :'book_8_author_2_full_name');
SELECT join_book_author(:'book_8_title', :'book_8_author_3_full_name');
SELECT join_book_author(:'book_8_title', :'book_8_author_4_full_name');
SELECT join_book_author(:'book_8_title', :'book_8_author_5_full_name');
SELECT join_book_author(:'book_8_title', :'book_8_author_6_full_name');
SELECT join_book_author(:'book_8_title', :'book_8_author_7_full_name');
SELECT join_book_author(:'book_8_title', :'book_8_author_8_full_name');
SELECT join_book_author(:'book_8_title', :'book_8_author_9_full_name');
SELECT join_book_author(:'book_8_title', :'book_8_author_10_full_name');
SELECT join_book_author(:'book_8_title', :'book_8_author_11_full_name');
-- book 9 author(s)
SELECT join_book_author(:'book_9_title', :'book_9_author_1_full_name');
-- book 10 author(s)
SELECT join_book_author(:'book_10_title', :'book_10_author_1_full_name');
-- book 11 author(s)
SELECT join_book_author(:'book_11_title', :'book_11_author_1_full_name');