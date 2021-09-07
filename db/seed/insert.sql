/* --------------------------------------------- CLEAR EXISTING TABLES --------------------------------------------- */
TRUNCATE TABLE reader, book, reader_book, book_read, read_entry, book_author, author CASCADE;


/* --------------------------------------------- HELPER FUNCTIONS --------------------------------------------- */
-- FUNCTION get_reader_id
CREATE OR REPLACE FUNCTION get_reader_id(arg_username VARCHAR)
RETURNS INT AS $$
BEGIN
  RETURN (SELECT reader.id FROM reader WHERE reader.username=$1);
END;
$$ LANGUAGE plpgsql;

-- FUNCTION get_book_id
CREATE OR REPLACE FUNCTION get_book_id(arg_book_title VARCHAR)
RETURNS INT AS $$
BEGIN
  RETURN (SELECT id FROM book WHERE title=$1);
END;
$$ LANGUAGE plpgsql;

-- FUNCTION get_author_id
CREATE OR REPLACE FUNCTION get_author_id(arg_author_full_name VARCHAR)
RETURNS INT AS $$
BEGIN
  RETURN (SELECT a.id FROM author AS a WHERE a.full_name=$1);
END;
$$ LANGUAGE plpgsql;

-- FUNCTION get_reader_book_id (JOIN table)
CREATE OR REPLACE FUNCTION get_reader_book_id(arg_username VARCHAR, arg_book_title VARCHAR)
RETURNS INT AS $$
BEGIN
  RETURN (
    SELECT r.id FROM reader_book AS r
    WHERE r.reader_id=(SELECT get_reader_id($1))
    AND r.book_id=(SELECT get_book_id($2))
  );
END;
$$ LANGUAGE plpgsql;


/* --------------------------------------------- INSERT reader --------------------------------------------- */
-- FUNCTION insert_reader
CREATE OR REPLACE FUNCTION insert_reader(arg_username VARCHAR, arg_first_name VARCHAR, arg_last_name VARCHAR, email VARCHAR)
RETURNS VOID AS $$
BEGIN
  INSERT INTO reader (username, first_name, last_name, email)
  VALUES ($1, $2, $3, $4);
END;
$$ LANGUAGE plpgsql;

-- DECLARE reader information
\set username_1 'orenjiku'
\set first_name_1 'william'
\set last_name_1 'chang'
\set email_1 'wdchang86@gmail.com'

-- INSERT data using FUNCTION insert_reader and DECLARED reader variables as arguments
SELECT insert_reader(:'username_1', :'first_name_1', :'last_name_1', :'email_1');


/* --------------------------------------------- INSERT book --------------------------------------------- */
-- FUNCTION insert_book
CREATE OR REPLACE FUNCTION insert_book(
  arg_title VARCHAR,
  arg_title_sort VARCHAR,
  arg_published_date DATE,
  arg_published_date_edition DATE,
  arg_book_format VARCHAR,
  arg_total_pages INT,
  arg_blurb TEXT,
  arg_picture_link VARCHAR
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO book (title, title_sort, published_date, published_date_edition, book_format, total_pages, blurb, picture_link)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
END;
$$ LANGUAGE plpgsql;

-- DECLARE book information
\set book_1_title 'Xenos'
\set book_1_title_sort 'Xenos'
\set book_1_published_date '2001/05/01'
\set book_1_published_date_edition '2015/07/21'
\set book_1_book_format 'Paperback'
\set book_1_total_pages 416
\set book_1_blurb 'The Inquisition moves amongst mankind like an avenging shadow, striking down the enemies of humanity with uncompromising ruthlessness. When he finally corners an old foe, Inquisitor Gregor Eisenhorn is drawn into a sinister conspiracy. As events unfold and he gathers allies – and enemies – Eisenhorn faces a vast interstellar cabal and the dark power of daemons, all racing to recover an arcane text of abominable power: an ancient tome known as the Necroteuch.'
\set book_1_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1424053669l/23492371.jpg'

\set book_2_title 'Malleus'
\set book_2_title_sort 'Malleus'
\set book_2_published_date '2001/12/27'
\set book_2_published_date_edition '2015/08/11'
\set book_2_book_format 'Paperback'
\set book_2_total_pages 416
\set book_2_blurb 'Part two of the epic Eisenhorn trilogy returns. \n\nA century after his recovery of the alien Necroteuch, Gregor Eisenhorn is one of the Imperial Inquisition’s most celebrated agents. But when a face from his past returns to haunt him, and he is implicated in a great tragedy that devastates the world of Thracian Primaris, Eisenhorn’s universe crumbles around him. The daemon Cherubael is back, and seeks to bring the inquisitor to ruin – either by his death, or by turning him to the service of the Dark Gods.'
\set book_2_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1427161165l/23492350.jpg'

\set book_3_title 'Hereticus'
\set book_3_title_sort 'Hereticus'
\set book_3_published_date '2002/07/30'
\set book_3_published_date_edition '2015/09/15'
\set book_3_book_format 'Paperback'
\set book_3_total_pages 416
\set book_3_blurb 'Part three of the epic Eisenhorn trilogy returns. \n\nHunted by his former allies as a radical and enemy of the Imperium, Inquisitor Gregor Eisenhorn must fight to prove that he remains loyal as he tracks down a dangerous heretic whom the Inquisition believes dead – the dread former Inquisitor Quixos. As he grows more desperate for victory, Eisenhorn uses ever darker means to achieve his goals – but how far can he go using the weapons of the enemy until he becomes that very enemy – and no different to the traitor he hunts?'
\set book_3_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1430084067l/23492348.jpg'

\set book_4_title 'Ravenor: The Omnibus'
\set book_4_title_sort 'Ravenor: The Omnibus'
\set book_4_published_date '2009/07/28'
\set book_4_published_date_edition '2019/07/23'
\set book_4_book_format 'Paperback'
\set book_4_total_pages 880
\set book_4_blurb 'Inquisitor Ravenor and his followers investigate a daemonic conspiracy that stretches across space and time in three classic novels by Dan Abnett. \n\nIn the war-torn future of the 41st millennium, the Inquisition fights a secret war against the darkest enemies of mankind – the alien, the heretic and the daemon. The three stories in this omnibus tell the tale of Inquisitor Gideon Ravenor and his lethal band of operatives, whose investigations take them from the heart of the Scarus Sector to the wildest regions of space beyond, and even through time itself. Wherever they go, and whatever dangers they face, they will never give up until their mission succeeds. \n\nContains the novels Ravenor, Ravenor Returned and Ravenor Regue, plus three short stories.'
\set book_4_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1545478110l/42641133._SY475_.jpg'

\set book_5_title 'The Magos'
\set book_5_title_sort 'Magos, The'
\set book_5_published_date '2018/02/24'
\set book_5_published_date_edition '2018/03/06'
\set book_5_book_format 'Paperback'
\set book_5_total_pages 720
\set book_5_blurb 'Inquisitor Eisenhorn returns in a stunning new novel that pits him against his oldest foe, forcing him to finally confront the growing darkness within his own soul. \n\nInquisitor Gregor Eisenhorn has spent his life stalking the darkest and most dangerous corners of the galaxy in pursuit of heresy and Chaos, but how long can a man walk that path without succumbing to the lure of the warp? Pursuing heretics in the remote worlds of the Imperium, Eisenhorn must confront the truth about himself. Is he still a champion of the Throne? Or has he been seduced by the very evil that he hunts? The Magos is the brand new, full-length fourth novel in the hugely popular Eisenhorn series. This paperback edition also includes the definitive casebook of Gregor Eisenhorn, collecting together all twelve of Dan Abnett’s Inquisition short stories, several of which have never been in print before. These additional stories have been compiled by the author to act as an essential prologue to this long-awaited new novel, while also serving as an indispensable companion to the original Eisenhorn trilogy.'
\set book_5_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1506373817l/36304173._SY475_.jpg'

\set book_6_title 'Honourbound'
\set book_6_title_sort 'Honourbound'
\set book_6_published_date '2019/02/23'
\set book_6_published_date_edition '2019/09/03'
\set book_6_book_format 'Paperback'
\set book_6_total_pages 496
\set book_6_blurb 'Uncompromising and fierce, Commissar Severina Raine has always served the Imperium with the utmost distinction. Attached to the Eleventh Antari Rifles, she instills order and courage in the face of utter horror. The Chaos cult, the Sighted, have swept throughout the Bale Stars and a shadow has fallen across its benighted worlds. A great campaign led by the vaunted hero Lord-General Militant Alar Serek is underway to free the system from tyranny and enslavement but the price of victory must be paid in blood. But what secrets do the Sighted harbour, secrets that might cast a light onto Raine’s own troubled past? Only by embracing her duty and staying true to her belief in the Imperium and the commissar’s creed can she hope to survive this crucible, but even then will that be enough?'
\set book_6_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1545477896l/42789259._SY475_.jpg'

\set book_7_title 'Cadia Stands'
\set book_7_title_sort 'Cadia Stands'
\set book_7_published_date '2017/09/23'
\set book_7_published_date_edition '2018/03/06'
\set book_7_book_format 'Paperback'
\set book_7_total_pages 320
\set book_7_blurb 'The brutal war for Cadia is decided, as Lord Castellan Ursarkar Creed and the armies of the Imperium fight to halt the Thirteenth Black Crusade and prevent a calamity on a galactic scale. \n\nUnder almost constant besiegement by the daemonic hosts pouring from the Eye of Terror, Cadia stands as a bulwark against tyranny and death. Its fortresses and armies have held back the hordes of Chaos for centuries, but that grim defiance is about to reach its end. As Abaddon’s Thirteenth Black Crusade batters Cadia’s defences and the armies of the Imperium flock to reinforce this crucial world, a terrible ritual long in the making comes to fruition, and the delicate balance of this brutal war shifts… From the darkness, a hero rises to lead the beleaguered defenders, Lord Castellan Ursarkar Creed, but even with the armoured might of the Astra Militarum and the strength of the Adeptus Astartes at his side, it may not be enough to avert disaster and prevent the fall of Cadia. While Creed lives, there is hope. While there is breath in the body of a single defender, Cadia Stands… but for how much longer?'
\set book_7_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1497083669l/35297654._SY475_.jpg'

\set book_8_title 'Maledictions: A Horror Anthology'
\set book_8_title_sort 'Maledictions: A Horror Anthology'
\set book_8_published_date '2019/03/30'
\set book_8_published_date_edition '2019/04/02'
\set book_8_book_format 'Paperback'
\set book_8_total_pages 352
\set book_8_blurb 'A eclectic collection of gut wrenching tales to spook and scare. \n\nHorror is no stranger to the worlds of Warhammer. Its very fabric is infested with the arcane, the strange and the downright terrifying. From the cold, vastness of the 41st millenium to the creeping evil at large in the Mortal Realms, this anthology of short stories explores the sinister side of Warhammer in a way it never has been before. Psychological torment, visceral horrors, harrowing tales of the supernatural and the nightmares buried within, this collection brings together some of the best horror writing from the Black Library. \n\nFeaturing stories from Graham McNeill, Cassandra Khaw, Alec Worley, David Annandale and more.'
\set book_8_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1548642309l/40744548.jpg'

\set book_9_title 'Cadian Honour'
\set book_9_title_sort 'Cadian Honour'
\set book_9_published_date '2018/12/26'
\set book_9_published_date_edition '2019/09/17'
\set book_9_book_format 'Paperback'
\set book_9_total_pages 496
\set book_9_blurb 'Sent to the capital world of Potence, Sergeant Minka Lesk and the Cadian 101st discover that though Cadia may have fallen, their duty continues. \n\nFor ten thousand years, Cadia stood as a bastion against the daemonic tide spewing forth from the Eye of Terror. But now the Fortress World lies in ruins, its armies decimated in the wake of Abaddon the Despoiler and his Thirteenth Black Crusade. Those who survived, though haunted by the loss of their beloved homeworld, remain bloodied and unbarred, fighting ruthlessly in the Emperor’s name. \n\nAmongst them is the indomitable Sergeant Minka Lesk. Sent to the capital world of Potence, Lesk and the Cadian 101st company soon discover that a rot runs through the very heart of the seemingly peaceful world. Lesk knows she must excise this taint of Chaos, for it is not only her life and those of her company at stake, but also the honour of Cadia itself.'
\set book_9_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1552227521l/44180913.jpg'

\set book_10_title 'The Uriel Ventris Chronicles: Volume One'
\set book_10_title_sort 'Uriel Ventris Chronicles: Volume One, The'
\set book_10_published_date '2016/11/15'
\set book_10_published_date_edition '2019/01/08'
\set book_10_book_format 'Paperback'
\set book_10_total_pages 800
\set book_10_blurb 'The Ultramarines are a byword for loyalty and courage, their martial prowess is legendary and is second only to the God-Emperor. Graham McNeill’s epic trilogy of Ultramarines novels is a masterpiece of non-stop action! Containing the novels Nightbringer, Warriors of Ultramar and Dead Sky, Black Sun, the series follows the adventures of Space Marine Captain Uriel Ventris and the Ultramarines as they battle against the enemies of mankind. From their home world of Macragge, into the dreaded Eye of Terror and beyond, Graham McNeill’s prose rattles like gunfire and brings the Space Marines to life like never before.'
\set book_10_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1626758004l/58593308.jpg'

\set book_11_title 'The Uriel Ventris Chronicles: Volume Two'
\set book_11_title_sort 'The Uriel Ventris Chronicles: Volume Two, The'
\set book_11_published_date '2016/11/15'
\set book_11_published_date_edition '2019/08/20'
\set book_11_book_format 'Paperback'
\set book_11_total_pages 848
\set book_11_blurb 'The second omnibus of stories featuring one of Warhammer 40,000''s most prominent characters, Ultramarine Captain Uriel Ventris. \n\nThe Ultramarines are the epitome of a Space Marine Chapter. Warriors without peer, their name is a byword for discipline and honour, and their heroic deeds are legendary. \n\nCaptain Uriel Ventris fights to prove his worth and return to the hallowed ranks of the Chapter after his exile to the Eye of Terror. But as the Iron Warriors move against Ultramar, a grim premonition comes to light: Ventris will have a part to play in the coming war... for good or ill. The ongoing story of the Uriel Ventris continues in this omnibus edition, featuring the novels The Killing Ground, Courage and Honour and The Chapter''s Due, as well as several short stories and the classic comic ''Black Bone Road''.'
\set book_11_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1561287919l/44180905.jpg'

\set book_12_title 'Iron Warriors: The Omnibus'
\set book_12_title_sort 'Iron Warriors: The Omnibus'
\set book_12_published_date '2016/11/15'
\set book_12_published_date_edition '2019/08/20'
\set book_12_book_format 'Paperback'
\set book_12_total_pages 688
\set book_12_blurb 'The Iron Warriors are Chaos Space Marines with unrivalled expertise in the art of siege warfare. With great batteries of artillery and all the favours of the Ruinous Powers at their command, there is no fortress in the galaxy that can stand against them for long. \n\nThis omnibus follows the schemes of the embittered Warsmith Honsou in his struggles against the hated Space Marines of the Imperium. Drawing upon characters and events from author Graham McNeill’s popular Ultramarines series and for the first time in a single publication, Storm of Iron and the novella Iron Warrior are gathered along with short stories The Enemy of My Enemy, The Heraclitus Effect and The Skull Harvest.'
\set book_12_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1625358426l/58481729.jpg'

\set book_13_title 'The Swords of Calth'
\set book_13_title_sort 'Swords of Calth, The'
\set book_13_published_date '2021/02/27'
\set book_13_published_date_edition '2021/02/27'
\set book_13_book_format 'Hardcover'
\set book_13_total_pages 258
\set book_13_blurb 'A Uriel Ventris novel \n\nUriel Ventris returns! Newly ascended to the ranks of the Primaris Space Marines, Ventris leads the Ultramarines Fourth Company – the famed Swords of Calth – to war against the ancient necrons. Old enemies arise, as Ventris'' past and present collide in brutal battle. \n\nREAD IT BECAUSE \nOne of Black Library''s longest-running series continues – and the hero''s been given a new lease of life as a Primaris Space Marine. Discover how Ventris adapts to his new life even as his past comes back to haunt him. \n\nTHE STORY \nUriel Ventris, newly ascended to the ranks of the Primaris, leads warriors of the Fourth Company from the Indomitus Crusade of Roboute Guilliman to a world on the frontiers of Ultramar. Once a battleground against the orks, Sycorax is now under furious assault from an enemy of ancient times – the necrons. The Ultramarines have faced these baleful xenos before, but Uriel senses the hand of a foe from his past at work on Sycorax, a tally unfinished and a debt to the Imperium finally come due. \n\nTrapped deep in a devastated city, Uriel leads the Swords of Calth into battle, and must adapt to his new incarnation as one of the Primaris – a challenge that will test his soul as much as it will test him as a warrior.'
\set book_13_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1628695156l/58749658._SY475_.jpg'

\set book_14_title 'Warden of the Blade'
\set book_14_title_sort 'Warden of the Blade'
\set book_14_published_date '2016/11/12'
\set book_14_published_date_edition '2018/01/23'
\set book_14_book_format 'Paperback'
\set book_14_total_pages 320
\set book_14_blurb 'The noble Castellan Crowe of the Grey Knights Chapter must wield the cursed Blade of Antwyr, an indestructable weapon imbued with evil daemonic power. \n\nCastellan Crowe, Brotherhood Champion of the Purifier order of the Grey Knights, bears a heavy burden – to be the warden of the dread Blade of Antwyr. Its malevolent voice is forever in his head, trying to crack his resolve, urging him to unleash a power he must never use. The toll is terrible – how long before the incorruptible Crowe is at last defeated? Under the command of Castellan Gavallan, Crowe and his brother Purifiers bring purging flame to a daemonic incursion that threatens to consume the world of Sandava I. However, what awaits them there is more insidious and more powerful than they imagine, and they must reckon too with the machinations of the Blade, as it seeks to destroy its guardian and drown the galaxy in blood.'
\set book_14_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1497084986l/34466775._SY475_.jpg'

\set book_15_title 'Deathwatch'
\set book_15_title_sort 'Deathwatch'
\set book_15_published_date '2013/04/11'
\set book_15_published_date_edition '2019/10/15'
\set book_15_book_format 'Paperback'
\set book_15_total_pages 512
\set book_15_blurb 'Action packed novel featuring the galaxies foremost alien hunting taskforce, the Deathwatch. Led by Librarian Karras, the elite alien-hunting Talon Squad must penetrate a genestealer lair and put the abominations to the flame or face the consequences of an entire planet''s extinction. \n\nGathered from the many Chapters of Space Marines, the Deathwatch are elite, charged with defending the Imperium of Man from aliens. Six Space Marines, strangers from different words, make up Talon Squad. On 31-Caro, a new terror has emerged, a murderous shadow that stalks the dark, and only the Deathwatch can stop it. Under the direction of a mysterious Inquisitor Lord known only as Sigma, they must cleanse this planet or die in the attempt.'
\set book_15_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1561288604l/52357292._SX318_SY475_.jpg'

\set book_16_title 'The Carrion Throne'
\set book_16_title_sort 'Carrion Throne, The'
\set book_16_published_date '2017/04/05'
\set book_16_published_date_edition '2018/05/18'
\set book_16_book_format 'Paperback'
\set book_16_total_pages 384
\set book_16_blurb 'Inquisitor Erasmus Crowl and his acolyte Spinoza follow the trail of a shadowy conspiracy on Holy Terra itself, the capital world of the Imperium. \n\nIn the hellish sprawl of Imperial Terra, Ordo Hereticus Inquisitor Erasmus Crowl serves as a stalwart and vigilant protector, for even the Throneworld is not immune to the predations of its enemies. In the course of his Emperor-sworn duty, Crowl becomes embroiled in a dark conspiracy, one that leads all the way to the halls of the Imperial Palace. As he plunges deeper into the shadowy underbelly of the many palace districts, his investigation attracts the attention of hidden forces, and soon he and his acolyte Spinoza are being hunted – by heretics, xenos, servants of the Dark Powers, or perhaps even rival elements of the Inquisition itself. Soon they discover a terrible truth, one that if allowed to get out could undermine the very fabric of the Imperium itself.'
\set book_16_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1507457967l/36373739._SY475_.jpg'

\set book_17_title 'The Hollow Mountain'
\set book_17_title_sort 'Hollow Mountain, The'
\set book_17_published_date '2019/07/20'
\set book_17_published_date_edition '2020/02/04'
\set book_17_book_format 'Paperback'
\set book_17_total_pages 352
\set book_17_blurb 'Book 2 in the Vaults of Terra mini-series. Discover what happens when Chaos comes to the Throneworld itself for the first time in ten millennia..... \n\nInquisitor Erasmus Crowl has discovered a terrible plot, its roots firmly planted in the very highest levels of Terra. Pursuing it is fraught with risk, but Crowl’s sense of duty compels him to persevere. He and his acolyte Spinoza run down their leads in secret, knowing that their every move invites danger, but even as they begin to reveal the truth, a greater peril is unfolding in the skies – the Great Rift is becoming manifest. During the madness that threatens to tear Terra asunder, Crowl’s Inquisitorial base of operations comes under attack and is badly ravaged. As his world begins to unravel and a new, bloody age dawns, can Crowl stay true to his course and expose the horror that lies at the heart of the Hollow Mountain?'
\set book_17_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1563199563l/51086449._SX318_SY475_.jpg'

\set book_18_title 'Kingsblade'
\set book_18_title_sort 'Kingsblade'
\set book_18_published_date '2017/02/01'
\set book_18_published_date_edition '2017/08/22'
\set book_18_book_format 'Paperback'
\set book_18_total_pages 368
\set book_18_blurb 'Imperial Knight Titans clash as an internecine war ravages the Knights of Adrastapol. \n\nThe Knight Houses of Adrastapol are both noble and righteous, and when the Imperial world of Donatos falls to the heresy of the Word Bearers, they are foremost in the vanguard to retake it. Led by High King Tolwyn Draconis, the Knights are peerless in battle and strike deep into the enemy’s ranks. But the war soon turns when a terrible tragedy strikes, casting the Imperial campaign into anarchy. As desperation grows, unblooded Knights Errant Danial and Luk must quickly learn the ways of war to prevent an unholy ritual, or Donatos will be lost and all the noble Houses of Adrastapol with it.'
\set book_18_picture_link 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1478803265l/32902466.jpg'

-- INSERT book using previously declared variables
SELECT insert_book(:'book_1_title', :'book_1_title_sort', :'book_1_published_date', :'book_1_published_date_edition', :'book_1_book_format', :'book_1_total_pages', :'book_1_blurb', :'book_1_picture_link');
SELECT insert_book(:'book_2_title', :'book_2_title_sort', :'book_2_published_date', :'book_2_published_date_edition', :'book_2_book_format', :'book_2_total_pages', :'book_2_blurb', :'book_2_picture_link');
SELECT insert_book(:'book_3_title', :'book_3_title_sort', :'book_3_published_date', :'book_3_published_date_edition', :'book_3_book_format', :'book_3_total_pages', :'book_3_blurb', :'book_3_picture_link');
SELECT insert_book(:'book_4_title', :'book_4_title_sort', :'book_4_published_date', :'book_4_published_date_edition', :'book_4_book_format', :'book_4_total_pages', :'book_4_blurb', :'book_4_picture_link');
SELECT insert_book(:'book_5_title', :'book_5_title_sort', :'book_5_published_date', :'book_5_published_date_edition', :'book_5_book_format', :'book_5_total_pages', :'book_5_blurb', :'book_5_picture_link');
SELECT insert_book(:'book_6_title', :'book_6_title_sort', :'book_6_published_date', :'book_6_published_date_edition', :'book_6_book_format', :'book_6_total_pages', :'book_6_blurb', :'book_6_picture_link');
SELECT insert_book(:'book_7_title', :'book_7_title_sort', :'book_7_published_date', :'book_7_published_date_edition', :'book_7_book_format', :'book_7_total_pages', :'book_7_blurb', :'book_7_picture_link');
SELECT insert_book(:'book_8_title', :'book_8_title_sort', :'book_8_published_date', :'book_8_published_date_edition', :'book_8_book_format', :'book_8_total_pages', :'book_8_blurb', :'book_8_picture_link');
SELECT insert_book(:'book_9_title', :'book_9_title_sort', :'book_9_published_date', :'book_9_published_date_edition', :'book_9_book_format', :'book_9_total_pages', :'book_9_blurb', :'book_9_picture_link');
SELECT insert_book(:'book_10_title', :'book_10_title_sort', :'book_10_published_date', :'book_10_published_date_edition', :'book_10_book_format', :'book_10_total_pages', :'book_10_blurb', :'book_10_picture_link');
SELECT insert_book(:'book_11_title', :'book_11_title_sort', :'book_11_published_date', :'book_11_published_date_edition', :'book_11_book_format', :'book_11_total_pages', :'book_11_blurb', :'book_11_picture_link');
SELECT insert_book(:'book_12_title', :'book_12_title_sort', :'book_12_published_date', :'book_12_published_date_edition', :'book_12_book_format', :'book_12_total_pages', :'book_12_blurb', :'book_12_picture_link');
SELECT insert_book(:'book_13_title', :'book_13_title_sort', :'book_13_published_date', :'book_13_published_date_edition', :'book_13_book_format', :'book_13_total_pages', :'book_13_blurb', :'book_13_picture_link');
SELECT insert_book(:'book_14_title', :'book_14_title_sort', :'book_14_published_date', :'book_14_published_date_edition', :'book_14_book_format', :'book_14_total_pages', :'book_14_blurb', :'book_14_picture_link');
SELECT insert_book(:'book_15_title', :'book_15_title_sort', :'book_15_published_date', :'book_15_published_date_edition', :'book_15_book_format', :'book_15_total_pages', :'book_15_blurb', :'book_15_picture_link');
SELECT insert_book(:'book_16_title', :'book_16_title_sort', :'book_16_published_date', :'book_16_published_date_edition', :'book_16_book_format', :'book_16_total_pages', :'book_16_blurb', :'book_16_picture_link');
SELECT insert_book(:'book_17_title', :'book_17_title_sort', :'book_17_published_date', :'book_17_published_date_edition', :'book_17_book_format', :'book_17_total_pages', :'book_17_blurb', :'book_17_picture_link');
SELECT insert_book(:'book_18_title', :'book_18_title_sort', :'book_18_published_date', :'book_18_published_date_edition', :'book_18_book_format', :'book_18_total_pages', :'book_18_blurb', :'book_18_picture_link');


/* --------------------------------------------------- INSERT reader_book --------------------------------------------------- */
-- FUNCTION insert_reader_book
CREATE OR REPLACE FUNCTION insert_reader_book(arg_username VARCHAR, arg_book_title VARCHAR)
RETURNS VOID AS $$
DECLARE
  var_reader_id INT = get_reader_id($1);
  var_book_id INT = get_book_id($2);
BEGIN
  INSERT INTO reader_book (reader_id, book_id)
  VALUES (var_reader_id, var_book_id);
END;
$$ LANGUAGE plpgsql;

-- INSERT relationship between reader and book
SELECT insert_reader_book(:'username_1', :'book_1_title');
SELECT insert_reader_book(:'username_1', :'book_2_title');
SELECT insert_reader_book(:'username_1', :'book_3_title');
SELECT insert_reader_book(:'username_1', :'book_4_title');
SELECT insert_reader_book(:'username_1', :'book_5_title');
SELECT insert_reader_book(:'username_1', :'book_6_title');
SELECT insert_reader_book(:'username_1', :'book_7_title');
SELECT insert_reader_book(:'username_1', :'book_8_title');
SELECT insert_reader_book(:'username_1', :'book_9_title');
SELECT insert_reader_book(:'username_1', :'book_10_title');
SELECT insert_reader_book(:'username_1', :'book_11_title');
SELECT insert_reader_book(:'username_1', :'book_12_title');
SELECT insert_reader_book(:'username_1', :'book_13_title');
SELECT insert_reader_book(:'username_1', :'book_14_title');
SELECT insert_reader_book(:'username_1', :'book_15_title');
SELECT insert_reader_book(:'username_1', :'book_16_title');
SELECT insert_reader_book(:'username_1', :'book_17_title');
SELECT insert_reader_book(:'username_1', :'book_18_title');


/* --------------------------------------------- INSERT read_entry --------------------------------------------- */
-- FUNCTION insert_read_entry
CREATE OR REPLACE FUNCTION insert_read_entry(
  arg_username VARCHAR,
  arg_book_title VARCHAR,
  arg_date_read TIMESTAMP,
  arg_pages_read INT,
  arg_current_page INT,
  arg_current_percent DECIMAL
)
RETURNS VOID AS $$
DECLARE
  var_reader_book_id INT = get_reader_book_id($1, $2);
BEGIN
  INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, reader_book_id)
  VALUES ($3, $4, $5, $6, var_reader_book_id);
END;
$$ LANGUAGE plpgsql;

-- INSERT read_entry data
-- INSERT book_1
SELECT insert_read_entry(:'username_1', :'book_1_title', '2021-05-29', 69, 69, 16.59);
SELECT insert_read_entry(:'username_1', :'book_1_title', '2021-05-30', 122, 191, 45.91);
SELECT insert_read_entry(:'username_1', :'book_1_title', '2021-05-31', 58, 249, 59.86);
SELECT insert_read_entry(:'username_1', :'book_1_title', '2021-06-01', 104, 353, 84.86);
SELECT insert_read_entry(:'username_1', :'book_1_title', '2021-06-02', 63, 416, 100);

-- INSERT book_2
SELECT insert_read_entry(:'username_1', :'book_2_title', '2021-06-02', 41, 41, 9.86);
SELECT insert_read_entry(:'username_1', :'book_2_title', '2021-06-03', 30, 71, 17.07);
SELECT insert_read_entry(:'username_1', :'book_2_title', '2021-06-04', 36, 107, 25.72);
SELECT insert_read_entry(:'username_1', :'book_2_title', '2021-06-05', 70, 177, 42.55);
SELECT insert_read_entry(:'username_1', :'book_2_title', '2021-06-06', 180, 357, 85.82);
SELECT insert_read_entry(:'username_1', :'book_2_title', '2021-06-07', 59, 416, 100);

-- INSERT book_3
SELECT insert_read_entry(:'username_1', :'book_3_title', '2021-06-07', 43, 43, 10.34);
SELECT insert_read_entry(:'username_1', :'book_3_title', '2021-06-08', 54, 97, 23.32);
SELECT insert_read_entry(:'username_1', :'book_3_title', '2021-06-09', 80, 177, 42.55);
SELECT insert_read_entry(:'username_1', :'book_3_title', '2021-06-10', 48, 225, 54.09);
SELECT insert_read_entry(:'username_1', :'book_3_title', '2021-06-11', 42, 267, 64.18);
SELECT insert_read_entry(:'username_1', :'book_3_title', '2021-06-12', 149, 416, 100);

-- INSERT book_4
SELECT insert_read_entry(:'username_1', :'book_4_title', '2021-06-13', 78, 78, 8.86);
SELECT insert_read_entry(:'username_1', :'book_4_title', '2021-06-14', 38, 116, 13.18);
SELECT insert_read_entry(:'username_1', :'book_4_title', '2021-06-16', 37, 153, 17.39);
SELECT insert_read_entry(:'username_1', :'book_4_title', '2021-06-19', 98, 251, 28.52);
SELECT insert_read_entry(:'username_1', :'book_4_title', '2021-06-20', 21, 272, 30.91);
SELECT insert_read_entry(:'username_1', :'book_4_title', '2021-06-21', 50, 324, 36.82);
SELECT insert_read_entry(:'username_1', :'book_4_title', '2021-06-22', 51, 375, 42.61);
SELECT insert_read_entry(:'username_1', :'book_4_title', '2021-06-23', 28, 403, 45.8);
SELECT insert_read_entry(:'username_1', :'book_4_title', '2021-06-24', 125, 528, 60);
SELECT insert_read_entry(:'username_1', :'book_4_title', '2021-06-25', 139, 667, 76.93);
SELECT insert_read_entry(:'username_1', :'book_4_title', '2021-06-26', 213, 880, 100);

-- INSERT book_5
SELECT insert_read_entry(:'username_1', :'book_5_title', '2021-06-27', 210, 210, 29.17);
SELECT insert_read_entry(:'username_1', :'book_5_title', '2021-06-28', 102, 312, 43.33);
SELECT insert_read_entry(:'username_1', :'book_5_title', '2021-06-29', 339, 651, 90.42);
SELECT insert_read_entry(:'username_1', :'book_5_title', '2021-06-29', 69, 720, 100);

-- INSERT book_6
SELECT insert_read_entry(:'username_1', :'book_6_title', '2021-06-30', 117, 117, 23.59);
SELECT insert_read_entry(:'username_1', :'book_6_title', '2021-07-01', 92, 209, 42.14);
SELECT insert_read_entry(:'username_1', :'book_6_title', '2021-07-02', 104, 313, 63.1);
SELECT insert_read_entry(:'username_1', :'book_6_title', '2021-07-03', 92, 405, 81.65);
SELECT insert_read_entry(:'username_1', :'book_6_title', '2021-07-04', 91, 496, 100);

-- INSERT book_7
SELECT insert_read_entry(:'username_1', :'book_7_title', '2021-07-05', 115, 115, 35.94);
SELECT insert_read_entry(:'username_1', :'book_7_title', '2021-07-06', 205, 320, 100);

-- INSERT book_8
SELECT insert_read_entry(:'username_1', :'book_8_title', '2021-07-07', 81, 81, 23.01);
SELECT insert_read_entry(:'username_1', :'book_8_title', '2021-07-08', 50, 131, 37.22);
SELECT insert_read_entry(:'username_1', :'book_8_title', '2021-07-09', 152, 283, 80.4);
SELECT insert_read_entry(:'username_1', :'book_8_title', '2021-07-10', 69, 352, 100);

-- INSERT book_9
SELECT insert_read_entry(:'username_1', :'book_9_title', '2021-07-10', 99, 99, 19.96);
SELECT insert_read_entry(:'username_1', :'book_9_title', '2021-07-11', 397, 496, 100);

-- INSERT book_10
SELECT insert_read_entry(:'username_1', :'book_10_title', '2021-07-12', 53, 53, 6.63);
SELECT insert_read_entry(:'username_1', :'book_10_title', '2021-07-13', 48, 101, 12.63);
SELECT insert_read_entry(:'username_1', :'book_10_title', '2021-07-14', 60, 161, 20.13);
SELECT insert_read_entry(:'username_1', :'book_10_title', '2021-07-15', 136, 297, 37.13);
SELECT insert_read_entry(:'username_1', :'book_10_title', '2021-07-16', 98, 395, 49.38);
SELECT insert_read_entry(:'username_1', :'book_10_title', '2021-07-17', 142, 537, 67.13);
SELECT insert_read_entry(:'username_1', :'book_10_title', '2021-07-18', 70, 607, 75.88);
SELECT insert_read_entry(:'username_1', :'book_10_title', '2021-07-19', 102, 709, 88.63);
SELECT insert_read_entry(:'username_1', :'book_10_title', '2021-07-19', 91, 800, 100);

-- INSERT book_11
SELECT insert_read_entry(:'username_1', :'book_11_title', '2021-07-20', 51, 51, 6.01);
SELECT insert_read_entry(:'username_1', :'book_11_title', '2021-07-21', 114, 165, 19.46);
SELECT insert_read_entry(:'username_1', :'book_11_title', '2021-07-22', 78, 243, 28.66);
SELECT insert_read_entry(:'username_1', :'book_11_title', '2021-07-23', 58, 301, 35.5);
SELECT insert_read_entry(:'username_1', :'book_11_title', '2021-07-24', 58, 359, 42.33);
SELECT insert_read_entry(:'username_1', :'book_11_title', '2021-07-25', 42, 401, 47.29);
SELECT insert_read_entry(:'username_1', :'book_11_title', '2021-07-26', 46, 447, 52.71);
SELECT insert_read_entry(:'username_1', :'book_11_title', '2021-07-27', 48, 495, 58.37);
SELECT insert_read_entry(:'username_1', :'book_11_title', '2021-08-06', 104, 599, 70.64);
SELECT insert_read_entry(:'username_1', :'book_11_title', '2021-08-07', 118, 717, 84.55);
SELECT insert_read_entry(:'username_1', :'book_11_title', '2021-08-08', 131, 848, 100);

-- INSERT book_12
SELECT insert_read_entry(:'username_1', :'book_12_title', '2021-07-28', 49, 49, 7.12);
SELECT insert_read_entry(:'username_1', :'book_12_title', '2021-07-29', 112, 161, 23.4);
SELECT insert_read_entry(:'username_1', :'book_12_title', '2021-07-30', 54, 215, 31.25);
SELECT insert_read_entry(:'username_1', :'book_12_title', '2021-07-31', 86, 301, 43.75);
SELECT insert_read_entry(:'username_1', :'book_12_title', '2021-08-01', 60, 361, 52.47);
SELECT insert_read_entry(:'username_1', :'book_12_title', '2021-08-02', 30, 391, 56.83);
SELECT insert_read_entry(:'username_1', :'book_12_title', '2021-08-03', 42, 433, 62.94);
SELECT insert_read_entry(:'username_1', :'book_12_title', '2021-08-04', 42, 475, 69.04);
SELECT insert_read_entry(:'username_1', :'book_12_title', '2021-08-05', 100, 575, 83.58);
SELECT insert_read_entry(:'username_1', :'book_12_title', '2021-08-08', 113, 688, 100);

-- INSERT book_13
SELECT insert_read_entry(:'username_1', :'book_13_title', '2021-08-08', 45, 45, 17.44);
SELECT insert_read_entry(:'username_1', :'book_13_title', '2021-08-09', 74, 119, 46.12);
SELECT insert_read_entry(:'username_1', :'book_13_title', '2021-08-10', 72, 191, 74.03);
SELECT insert_read_entry(:'username_1', :'book_13_title', '2021-08-11', 67, 258, 100);

-- INSERT book_14
SELECT insert_read_entry(:'username_1', :'book_14_title', '2021-08-11', 41, 41, 12.81);
SELECT insert_read_entry(:'username_1', :'book_14_title', '2021-08-12', 92, 133, 41.56);
SELECT insert_read_entry(:'username_1', :'book_14_title', '2021-08-13', 123, 256, 80.94);
SELECT insert_read_entry(:'username_1', :'book_14_title', '2021-08-14', 64, 320, 100);

-- INSERT book_15
SELECT insert_read_entry(:'username_1', :'book_15_title', '2021-08-14', 55, 55, 10.74);
SELECT insert_read_entry(:'username_1', :'book_15_title', '2021-08-15', 58, 113, 22.07);
SELECT insert_read_entry(:'username_1', :'book_15_title', '2021-08-16', 54, 167, 32.62);
SELECT insert_read_entry(:'username_1', :'book_15_title', '2021-08-17', 56, 223, 42.55);
SELECT insert_read_entry(:'username_1', :'book_15_title', '2021-08-18', 54, 277, 54.1);
SELECT insert_read_entry(:'username_1', :'book_15_title', '2021-08-19', 52, 329, 64.26);
SELECT insert_read_entry(:'username_1', :'book_15_title', '2021-08-20', 183, 512, 100);

-- INSERT book_16
SELECT insert_read_entry(:'username_1', :'book_16_title', '2021-08-21', 55, 55, 14.32);
SELECT insert_read_entry(:'username_1', :'book_16_title', '2021-08-22', 58, 113, 29.43);
SELECT insert_read_entry(:'username_1', :'book_16_title', '2021-08-23', 50, 163, 42.45);
SELECT insert_read_entry(:'username_1', :'book_16_title', '2021-08-24', 52, 215, 55.99);
SELECT insert_read_entry(:'username_1', :'book_16_title', '2021-08-25', 56, 271, 70.57);
SELECT insert_read_entry(:'username_1', :'book_16_title', '2021-08-26', 113, 384, 100);

-- INSERT book_17
SELECT insert_read_entry(:'username_1', :'book_17_title', '2021-08-27', 58, 59, 16.76);
SELECT insert_read_entry(:'username_1', :'book_17_title', '2021-08-28', 54, 113, 32.1);
SELECT insert_read_entry(:'username_1', :'book_17_title', '2021-08-29', 52, 165, 46.88);
SELECT insert_read_entry(:'username_1', :'book_17_title', '2021-08-30', 58, 223, 63.35);
SELECT insert_read_entry(:'username_1', :'book_17_title', '2021-08-31', 56, 279, 79.26);
SELECT insert_read_entry(:'username_1', :'book_17_title', '2021-09-01', 73, 352, 100);

-- INSERT book_18
SELECT insert_read_entry(:'username_1', :'book_18_title', '2021-08-27', 55, 55, 14.95);
SELECT insert_read_entry(:'username_1', :'book_18_title', '2021-08-28', 54, 109, 29.62);
SELECT insert_read_entry(:'username_1', :'book_18_title', '2021-08-29', 56, 165, 44.84);
SELECT insert_read_entry(:'username_1', :'book_18_title', '2021-08-30', 56, 221, 60.05);
SELECT insert_read_entry(:'username_1', :'book_18_title', '2021-09-01', 147, 368, 100);


/* --------------------------------------------- INSERT author --------------------------------------------- */
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
END;
$$ LANGUAGE plpgsql;

-- DECLARE author information
-- book 1 author
\set book_1_author_1_first_name 'Dan'
\set book_1_author_1_last_name 'Abnett'
\set book_1_author_1_full_name 'Dan Abnett'
-- book 2 author
\set book_2_author_1_first_name 'Dan'
\set book_2_author_1_last_name 'Abnett'
\set book_2_author_1_full_name 'Dan Abnett'
-- book 3 author
\set book_3_author_1_first_name 'Dan'
\set book_3_author_1_last_name 'Abnett'
\set book_3_author_1_full_name 'Dan Abnett'
-- book 4 author
\set book_4_author_1_first_name 'Dan'
\set book_4_author_1_last_name 'Abnett'
\set book_4_author_1_full_name 'Dan Abnett'
-- book 5 author
\set book_5_author_1_first_name 'Dan'
\set book_5_author_1_last_name 'Abnett'
\set book_5_author_1_full_name 'Dan Abnett'
-- book 6 author
\set book_6_author_1_first_name 'Rachel'
\set book_6_author_1_middle_name 'D.'
\set book_6_author_1_last_name 'Harrison'
\set book_6_author_1_full_name 'Rachel D. Harrison'
-- book 7 author
\set book_7_author_1_first_name 'Justin'
\set book_7_author_1_middle_name 'D.'
\set book_7_author_1_last_name 'Hill'
\set book_7_author_1_full_name 'Justin D. Hill'
-- book 8 authors
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
-- book 9 author
\set book_9_author_1_first_name 'Justin'
\set book_9_author_1_middle_name 'D.'
\set book_9_author_1_last_name 'Hill'
\set book_9_author_1_full_name 'Justin D. Hill'
-- book 10 author
\set book_10_author_1_first_name 'Graham'
\set book_10_author_1_last_name 'McNeill'
\set book_10_author_1_full_name 'Graham McNeill'
-- book 11 author
\set book_11_author_1_first_name 'Graham'
\set book_11_author_1_last_name 'McNeill'
\set book_11_author_1_full_name 'Graham McNeill'
-- book 12 author
\set book_12_author_1_first_name 'Graham'
\set book_12_author_1_last_name 'McNeill'
\set book_12_author_1_full_name 'Graham McNeill'
-- book 13 author
\set book_13_author_1_first_name 'Graham'
\set book_13_author_1_last_name 'McNeill'
\set book_13_author_1_full_name 'Graham McNeill'
-- book 14 author
\set book_14_author_1_first_name 'David'
\set book_14_author_1_last_name 'Annandale'
\set book_14_author_1_full_name 'David Annandale'
-- book 15 author
\set book_15_author_1_first_name 'Steve'
\set book_15_author_1_last_name 'Parker'
\set book_15_author_1_full_name 'Steve Parker'
-- book 16 author
\set book_16_author_1_first_name 'Chris'
\set book_16_author_1_last_name 'Wraight'
\set book_16_author_1_full_name 'Chris Wraight'
-- book 17 author
\set book_17_author_1_first_name 'Chris'
\set book_17_author_1_last_name 'Wraight'
\set book_17_author_1_full_name 'Chris Wraight'
-- book 18 author
\set book_18_author_1_first_name 'Andy'
\set book_18_author_1_last_name 'Clark'
\set book_18_author_1_full_name 'Andy Clark'

-- INSERT author using FUNCTION insert_author and DECLARED author variables as arguments, CHECK UNIQUE full_name (middle_name argument is optional)
-- book 1 author
SELECT insert_author(:'book_1_author_1_full_name', :'book_1_author_1_first_name', :'book_1_author_1_last_name');
-- book 2 author
SELECT insert_author(:'book_2_author_1_full_name', :'book_2_author_1_first_name', :'book_2_author_1_last_name');
-- book 3 author
SELECT insert_author(:'book_3_author_1_full_name', :'book_3_author_1_first_name', :'book_3_author_1_last_name');
-- book 4 author
SELECT insert_author(:'book_4_author_1_full_name', :'book_4_author_1_first_name', :'book_4_author_1_last_name');
-- book 5 author
SELECT insert_author(:'book_5_author_1_full_name', :'book_5_author_1_first_name', :'book_5_author_1_last_name');
-- book 6 author
SELECT insert_author(:'book_6_author_1_full_name', :'book_6_author_1_first_name', :'book_6_author_1_last_name');
-- book 7 author
SELECT insert_author(:'book_7_author_1_full_name', :'book_7_author_1_first_name', :'book_7_author_1_last_name', :'book_7_author_1_middle_name');
-- book 8 authors
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
-- book 9 author
SELECT insert_author(:'book_9_author_1_full_name', :'book_9_author_1_first_name', :'book_9_author_1_last_name', :'book_9_author_1_middle_name');
-- book 10 author
SELECT insert_author(:'book_10_author_1_full_name', :'book_10_author_1_first_name', :'book_10_author_1_last_name');
-- book 11 author
SELECT insert_author(:'book_11_author_1_full_name', :'book_11_author_1_first_name', :'book_11_author_1_last_name');
-- book 12 author
SELECT insert_author(:'book_12_author_1_full_name', :'book_12_author_1_first_name', :'book_12_author_1_last_name');
-- book 13 author
SELECT insert_author(:'book_13_author_1_full_name', :'book_13_author_1_first_name', :'book_13_author_1_last_name');
-- book 14 author
SELECT insert_author(:'book_14_author_1_full_name', :'book_14_author_1_first_name', :'book_14_author_1_last_name');
-- book 15 author
SELECT insert_author(:'book_15_author_1_full_name', :'book_15_author_1_first_name', :'book_15_author_1_last_name');
-- book 16 author
SELECT insert_author(:'book_16_author_1_full_name', :'book_16_author_1_first_name', :'book_16_author_1_last_name');
-- book 17 author
SELECT insert_author(:'book_17_author_1_full_name', :'book_17_author_1_first_name', :'book_17_author_1_last_name');
-- book 18 author
SELECT insert_author(:'book_18_author_1_full_name', :'book_18_author_1_first_name', :'book_18_author_1_last_name');


/* --------------------------------------------- INSERT book_author (JOIN TABLE) --------------------------------------------- */
-- FUNCTION join_book_author
CREATE OR REPLACE FUNCTION join_book_author(arg_book_title VARCHAR, arg_author_full_name VARCHAR)
RETURNS VOID AS $$
DECLARE
  var_book_id INT = get_book_id($1);
  var_author_id INT = get_author_id($2);
BEGIN
  INSERT INTO book_author (book_id, author_id)
  VALUES (var_book_id, var_author_id);
END;
$$ LANGUAGE plpgsql;

-- INSERT relationship between book and author
-- book 1 author
SELECT join_book_author(:'book_1_title', :'book_1_author_1_full_name');
-- book 2 author
SELECT join_book_author(:'book_2_title', :'book_2_author_1_full_name');
-- book 3 author
SELECT join_book_author(:'book_3_title', :'book_3_author_1_full_name');
-- book 4 author
SELECT join_book_author(:'book_4_title', :'book_4_author_1_full_name');
-- book 5 author
SELECT join_book_author(:'book_5_title', :'book_5_author_1_full_name');
-- book 6 author
SELECT join_book_author(:'book_6_title', :'book_6_author_1_full_name');
-- book 7 author
SELECT join_book_author(:'book_7_title', :'book_7_author_1_full_name');
-- book 8 authors
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
-- book 9 author
SELECT join_book_author(:'book_9_title', :'book_9_author_1_full_name');
-- book 10 author
SELECT join_book_author(:'book_10_title', :'book_10_author_1_full_name');
-- book 11 author
SELECT join_book_author(:'book_11_title', :'book_11_author_1_full_name');
-- book 12 author
SELECT join_book_author(:'book_12_title', :'book_12_author_1_full_name');
-- book 13 author
SELECT join_book_author(:'book_13_title', :'book_13_author_1_full_name');
-- book 14 author
SELECT join_book_author(:'book_14_title', :'book_14_author_1_full_name');
-- book 15 author
SELECT join_book_author(:'book_15_title', :'book_15_author_1_full_name');
-- book 16 author
SELECT join_book_author(:'book_16_title', :'book_16_author_1_full_name');
-- book 17 author
SELECT join_book_author(:'book_17_title', :'book_17_author_1_full_name');
-- book 18 author
SELECT join_book_author(:'book_18_title', :'book_18_author_1_full_name');


/* --------------------------------------------- UPDATE is_reading and is_finished --------------------------------------------- */
-- FUNCTION UPDATE reader_book
CREATE OR REPLACE FUNCTION update_reader_book(
  arg_username VARCHAR,
  arg_book_title VARCHAR,
  arg_days_read INT,
  arg_days_total INT,
  arg_is_reading BOOLEAN,
  arg_is_finished BOOLEAN
)
RETURNS VOID AS $$
DECLARE
  var_reader_id INT = get_reader_id($1);
  var_book_id INT = get_book_id($2);
BEGIN
  UPDATE reader_book
  SET days_read=$3, days_total=$4, is_reading=$5, is_finished=$6
    WHERE reader_book.id=(
      SELECT id
      FROM reader_book AS r
      WHERE r.reader_id=var_reader_id AND r.book_id=var_book_id
    );
END;
$$ LANGUAGE plpgsql;

-- UPDATE reader_book.is_finished to true
SELECT update_reader_book(:'username_1', :'book_1_title', 5, 5, FALSE, TRUE);
SELECT update_reader_book(:'username_1', :'book_2_title', 6, 6, FALSE, TRUE);
SELECT update_reader_book(:'username_1', :'book_3_title', 6, 6, FALSE, TRUE);
SELECT update_reader_book(:'username_1', :'book_4_title', 14, 14, FALSE, TRUE);
SELECT update_reader_book(:'username_1', :'book_5_title', 3, 4, FALSE, TRUE);
SELECT update_reader_book(:'username_1', :'book_6_title', 5, 5, FALSE, TRUE);
SELECT update_reader_book(:'username_1', :'book_7_title', 2, 2, FALSE, TRUE);
SELECT update_reader_book(:'username_1', :'book_8_title', 4, 4, FALSE, TRUE);
SELECT update_reader_book(:'username_1', :'book_9_title', 2, 2, FALSE, TRUE);
SELECT update_reader_book(:'username_1', :'book_10_title', 8, 8,  FALSE, TRUE);
SELECT update_reader_book(:'username_1', :'book_11_title', 11, 20, FALSE, TRUE);
SELECT update_reader_book(:'username_1', :'book_12_title', 10, 12, FALSE, TRUE);
SELECT update_reader_book(:'username_1', :'book_13_title', 4, 4, FALSE, TRUE);
SELECT update_reader_book(:'username_1', :'book_14_title', 4, 4, FALSE, TRUE);
SELECT update_reader_book(:'username_1', :'book_15_title', 6, 6, FALSE, TRUE);
SELECT update_reader_book(:'username_1', :'book_16_title', 6, 6, FALSE, TRUE);
SELECT update_reader_book(:'username_1', :'book_17_title', 6, 6, FALSE, TRUE);
SELECT update_reader_book(:'username_1', :'book_18_title', 5, 5, FALSE, TRUE);
-- UPDATE reader_book.is_reading to true


/* --------------------------------------------- DROP functions --------------------------------------------- */
DROP FUNCTION insert_reader, insert_book, insert_reader_book, insert_read_entry, insert_author, join_book_author, update_reader_book, get_reader_id, get_book_id, get_author_id, get_reader_book_id;