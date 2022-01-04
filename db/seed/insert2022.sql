/* --------------------------------------------- INSERT book --------------------------------------------- */
-- DECLARE book information
\set book_1_title 'All Systems Red'
\set book_1_title_sort 'all systems red'
\set book_1_published_date '2017/05/02'
\set book_1_edition_date '2019/01/22'
\set book_1_book_format 'Hardcover'
\set book_1_total_pages 149
\set book_1_blurb '"As a heartless killing machine, I was a complete failure." \n\nIn a corporate-dominated spacefaring future, planetary missions must be approved and supplied by the Company. Exploratory teams are accompanied by Company-supplied security androids, for their own safety. \n\nBut in a society where contracts are awarded to the lowest bidder, safety isn’t a primary concern. \n\nOn a distant planet, a team of scientists are conducting surface tests, shadowed by their Company-supplied ‘droid — a self-aware SecUnit that has hacked its own governor module, and refers to itself (though never out loud) as “Murderbot.” Scornful of humans, all it really wants is to be left alone long enough to figure out who it is. \n\nBut when a neighboring mission goes dark, it''s up to the scientists and their Murderbot to get to the truth.'
\set book_1_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1536742097l/40653269.jpg'

\set book_2_title 'Artificial Condition'
\set book_2_title_sort 'artificial condition'
\set book_2_published_date '2018/05/08'
\set book_2_edition_date '2018/05/08'
\set book_2_book_format 'Hardcover'
\set book_2_total_pages 158
\set book_2_blurb 'It has a dark past – one in which a number of humans were killed. A past that caused it to christen itself “Murderbot”. But it has only vague memories of the massacre that spawned that title, and it wants to know more. \n\nTeaming up with a Research Transport vessel named ART (you don’t want to know what the “A” stands for), Murderbot heads to the mining facility where it went rogue. \n\nWhat it discovers will forever change the way it thinks…'
\set book_2_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1505590203l/36223860._SY475_.jpg'

\set book_3_title 'Rogue Protocol'
\set book_3_title_sort 'rogue protocol'
\set book_3_published_date '2018/08/07'
\set book_3_edition_date '2018/08/07'
\set book_3_book_format 'Hardcover'
\set book_3_total_pages 158
\set book_3_blurb 'SciFi’s favorite antisocial A.I. is again on a mission. The case against the too-big-to-fail GrayCris Corporation is floundering, and more importantly, authorities are beginning to ask more questions about where Dr. Mensah’s SecUnit is. \n\nAnd Murderbot would rather those questions went away. For good.'
\set book_3_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1506001607l/35519101.jpg'

\set book_4_title 'Exit Strategy'
\set book_4_title_sort 'exit strategy'
\set book_4_published_date '2018/10/02'
\set book_4_edition_date '2018/10/02'
\set book_4_book_format 'Hardcover'
\set book_4_total_pages 176
\set book_4_blurb 'Murderbot wasn’t programmed to care. So, its decision to help the only human who ever showed it respect must be a system glitch, right? \n\nHaving traveled the width of the galaxy to unearth details of its own murderous transgressions, as well as those of the GrayCris Corporation, Murderbot is heading home to help Dr. Mensah—its former owner (protector? friend?)—submit evidence that could prevent GrayCris from destroying more colonists in its never-ending quest for profit. \n\nBut who’s going to believe a SecUnit gone rogue? \n\nAnd what will become of it when it’s caught?'
\set book_4_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1518642623l/35519109._SY475_.jpg'

\set book_5_title 'Network Effect'
\set book_5_title_sort 'network effect'
\set book_5_published_date '2020/05/05'
\set book_5_edition_date '2020/05/05'
\set book_5_book_format 'Hardcover'
\set book_5_total_pages 350
\set book_5_blurb 'Murderbot returns in its highly-anticipated, first, full-length standalone novel. \n\nYou know that feeling when you’re at work, and you’ve had enough of people, and then the boss walks in with yet another job that needs to be done right this second or the world will end, but all you want to do is go home and binge your favorite shows? And you''re a sentient murder machine programmed for destruction? Congratulations, you''re Murderbot. \n\nCome for the pew-pew space battles, stay for the most relatable A.I. you’ll read this century. \n\n— \n\nI’m usually alone in my head, and that’s where 90 plus percent of my problems are. \n\nWhen Murderbot''s human associates (not friends, never friends) are captured and another not-friend from its past requires urgent assistance, Murderbot must choose between inertia and drastic action. \n\nDrastic action it is, then.'
\set book_5_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1640597293l/52381770._SY475_.jpg'

-- INSERT book using previously declared variables
SELECT insert_book(:'book_1_title', :'book_1_title_sort', :'book_1_published_date', :'book_1_edition_date', :'book_1_book_format', :'book_1_total_pages', :'book_1_blurb', :'book_1_book_cover_url');
SELECT insert_book(:'book_2_title', :'book_2_title_sort', :'book_2_published_date', :'book_2_edition_date', :'book_2_book_format', :'book_2_total_pages', :'book_2_blurb', :'book_2_book_cover_url');
SELECT insert_book(:'book_3_title', :'book_3_title_sort', :'book_3_published_date', :'book_3_edition_date', :'book_3_book_format', :'book_3_total_pages', :'book_3_blurb', :'book_3_book_cover_url');
SELECT insert_book(:'book_4_title', :'book_4_title_sort', :'book_4_published_date', :'book_4_edition_date', :'book_4_book_format', :'book_4_total_pages', :'book_4_blurb', :'book_4_book_cover_url');
SELECT insert_book(:'book_5_title', :'book_5_title_sort', :'book_5_published_date', :'book_5_edition_date', :'book_5_book_format', :'book_5_total_pages', :'book_5_blurb', :'book_5_book_cover_url');


/* --------------------------------------------------- INSERT reader_book --------------------------------------------------- */
-- INSERT relationship between reader and book
SELECT insert_reader_book(:'username_1', :'book_1_title');
SELECT insert_reader_book(:'username_1', :'book_2_title');
SELECT insert_reader_book(:'username_1', :'book_3_title');
SELECT insert_reader_book(:'username_1', :'book_4_title');
SELECT insert_reader_book(:'username_1', :'book_5_title');


/* --------------------------------------------- INSERT read_instance --------------------------------------------- */
-- INSERT relationship between reader_book and read_instance
SELECT insert_read_instance(:'username_1', :'book_1_title');
SELECT insert_read_instance(:'username_1', :'book_2_title');
SELECT insert_read_instance(:'username_1', :'book_3_title');
SELECT insert_read_instance(:'username_1', :'book_4_title');
SELECT insert_read_instance(:'username_1', :'book_5_title');


/* --------------------------------------------- INSERT read_entry --------------------------------------------- */
-- INSERT read_entry data
-- INSERT book_1
SELECT insert_read_entry(:'username_1', :'book_1_title', '2021-01-01', 149, :'book_1_total_pages');
-- INSERT book_2
SELECT insert_read_entry(:'username_1', :'book_2_title', '2021-01-02', 158, :'book_2_total_pages');
-- INSERT book_3
SELECT insert_read_entry(:'username_1', :'book_3_title', '2021-01-03', 158, :'book_3_total_pages');
-- INSERT book_4
SELECT insert_read_entry(:'username_1', :'book_4_title', '2021-01-04', 176, :'book_4_total_pages');


/* --------------------------------------------- INSERT author --------------------------------------------- */
-- INSERT author and INSERT book_author tables
SELECT insert_author(:'book_1_title', 'Martha Wells');
SELECT insert_author(:'book_2_title', 'Martha Wells');
SELECT insert_author(:'book_3_title', 'Martha Wells');
SELECT insert_author(:'book_4_title', 'Martha Wells');
SELECT insert_author(:'book_5_title', 'Martha Wells');


/* --------------------------------------------- UPDATE read_instance --------------------------------------------- */
-- UPDATE read_instance.is_finished to true
SELECT update_read_instance(:'username_1', :'book_1_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_2_title', FALSE, TRUE, FALSE);
-- UPDATE read_instance.is_reading to true
SELECT update_read_instance(:'username_1', :'book_3_title', TRUE, FALSE, FALSE);
SELECT update_read_instance(:'username_1', :'book_4_title', TRUE, FALSE, FALSE);
SELECT update_read_instance(:'username_1', :'book_5_title', TRUE, FALSE, FALSE);


/* --------------------------------------------- UPDATE reader_book  --------------------------------------------- */
SELECT update_reader_book(:'username_1', :'book_1_title');
SELECT update_reader_book(:'username_1', :'book_2_title');
SELECT update_reader_book(:'username_1', :'book_3_title');
SELECT update_reader_book(:'username_1', :'book_4_title');
SELECT update_reader_book(:'username_1', :'book_5_title');