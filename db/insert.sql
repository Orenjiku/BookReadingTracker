/* change database name with {test} below */
\set my_db test
\c :my_db

/* Clears previous tables if they exist */
TRUNCATE TABLE reader, book, reader_book, book_read, read_entry, book_author, author CASCADE;

/* INSERT USER */
INSERT INTO reader (username, first_name, last_name, email) VALUES ('orenjiku', 'william', 'chang', 'wdchang86@gmail.com');

/* INSERT BOOKS */
INSERT INTO book (
  title,
  title_sort,
  total_pages,
  book_description,
  picture_link
)
VALUES (
'the uriel ventris chronicles: volume two',
'uriel ventris chronicles: volume two, the',
848,
'The second omnibus of stories featuring one of Warhammer 40,000''s most prominent characters, Ultramarine Captain Uriel Ventris.

The Ultramarines are the epitome of a Space Marine Chapter. Warriors without peer, their name is a byword for discipline and honour, and their heroic deeds are legendary.

Captain Uriel Ventris fights to prove his worth and return to the hallowed ranks of the Chapter after his exile to the Eye of Terror. But as the Iron Warriors move against Ultramar, a grim premonition comes to light: Ventris will have a part to play in the coming war... for good or ill. The ongoing story of the Uriel Ventris continues in this omnibus edition, featuring the novels The Killing Ground, Courage and Honour and The Chapter''s Due, as well as several short stories and the classic comin ''Black Bone Road''.',
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
'the uriel ventris chronicles: volume one',
'uriel ventris chronicles: volume one, the',
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
'cadian honour',
'cadian honour',
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
'maledictions: a horror anthology',
'maledictions: a horror anthology',
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
'cadia stands',
'cadia stands',
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
'honourbound',
'honourbound',
496,
'Uncompromising and fierce, Commissar Severina Raine has always served the Imperium with the utmost distinction. Attached to the Eleventh Antari Rifles, she instills order and courage in the face of utter horror. The Chaos cult, the Sighted, have swept throughout the Bale Stars and a shadow has fallen across its benighted worlds. A great campaign led by the vaunted hero Lord-General Militant Alar Serek is underway to free the system from tyranny and enslavement but the price of victory must be paid in blood. But what secrets do the Sighted harbour, secrets that might cast a light onto Raine’s own troubled past? Only by embracing her duty and staying true to her belief in the Imperium and the commissar’s creed can she hope to survive this crucible, but even then will that be enough?',
'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1545477896l/42789259._SY475_.jpg'
);


\set sample_id 1
\set sample_book_title 'the uriel ventris chronicles: volumn two'

/* Associates all ids in TABLE book to reader id */
INSERT INTO reader_book (reader_id, book_id)
  SELECT :sample_id, book.id
  FROM book;

/* Creates a row for each book of the reader */
INSERT INTO book_read (reader_book_id)
  SELECT reader_book.id
  FROM reader_book
  WHERE reader_book.reader_id=:sample_id;

/* Update book where is_reading = TRUE */
UPDATE book_read SET is_reading=TRUE
  WHERE book_read.id=(
    SELECT id FROM reader_book
      WHERE reader_book.reader_id=:sample_id AND reader_book.book_id=(SELECT id FROM book WHERE book.title=:sample_book_title)
  );