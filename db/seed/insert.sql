/* --------------------------------------------- CLEAR EXISTING TABLES --------------------------------------------- */
TRUNCATE TABLE reader, book, reader_book, read_instance, read_entry, book_author, author CASCADE;


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
    WHERE r.reader_id=get_reader_id($1)
    AND r.book_id=get_book_id($2)
  );
END;
$$ LANGUAGE plpgsql;

-- FUNCTION get_read_instance_id
CREATE OR REPLACE FUNCTION get_read_instance_id(arg_username VARCHAR, arg_book_title VARCHAR)
RETURNS INT AS $$
BEGIN
  RETURN (
    SELECT ri.id FROM read_instance AS ri
    WHERE ri.reader_book_id=get_reader_book_id($1, $2)
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
  arg_edition_date DATE,
  arg_book_format VARCHAR,
  arg_total_pages INT,
  arg_blurb TEXT,
  arg_book_cover_url VARCHAR
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO book (title, title_sort, published_date, edition_date, book_format, total_pages, blurb, book_cover_url)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
END;
$$ LANGUAGE plpgsql;

-- DECLARE book information
\set book_1_title 'Xenos'
\set book_1_title_sort 'xenos'
\set book_1_published_date '2001/05/01'
\set book_1_edition_date '2015/07/21'
\set book_1_book_format 'Paperback'
\set book_1_total_pages 416
\set book_1_blurb 'The Inquisition moves amongst mankind like an avenging shadow, striking down the enemies of humanity with uncompromising ruthlessness. When he finally corners an old foe, Inquisitor Gregor Eisenhorn is drawn into a sinister conspiracy. As events unfold and he gathers allies – and enemies – Eisenhorn faces a vast interstellar cabal and the dark power of daemons, all racing to recover an arcane text of abominable power: an ancient tome known as the Necroteuch.'
\set book_1_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1424053669l/23492371.jpg'

\set book_2_title 'Malleus'
\set book_2_title_sort 'malleus'
\set book_2_published_date '2001/12/27'
\set book_2_edition_date '2015/08/11'
\set book_2_book_format 'Paperback'
\set book_2_total_pages 416
\set book_2_blurb 'Part two of the epic Eisenhorn trilogy returns. \n\nA century after his recovery of the alien Necroteuch, Gregor Eisenhorn is one of the Imperial Inquisition’s most celebrated agents. But when a face from his past returns to haunt him, and he is implicated in a great tragedy that devastates the world of Thracian Primaris, Eisenhorn’s universe crumbles around him. The daemon Cherubael is back, and seeks to bring the inquisitor to ruin – either by his death, or by turning him to the service of the Dark Gods.'
\set book_2_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1427161165l/23492350.jpg'

\set book_3_title 'Hereticus'
\set book_3_title_sort 'hereticus'
\set book_3_published_date '2002/07/30'
\set book_3_edition_date '2015/09/15'
\set book_3_book_format 'Paperback'
\set book_3_total_pages 416
\set book_3_blurb 'Part three of the epic Eisenhorn trilogy returns. \n\nHunted by his former allies as a radical and enemy of the Imperium, Inquisitor Gregor Eisenhorn must fight to prove that he remains loyal as he tracks down a dangerous heretic whom the Inquisition believes dead – the dread former Inquisitor Quixos. As he grows more desperate for victory, Eisenhorn uses ever darker means to achieve his goals – but how far can he go using the weapons of the enemy until he becomes that very enemy – and no different to the traitor he hunts?'
\set book_3_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1430084067l/23492348.jpg'

\set book_4_title 'Ravenor: The Omnibus'
\set book_4_title_sort 'ravenor: the omnibus'
\set book_4_published_date '2009/07/28'
\set book_4_edition_date '2019/07/23'
\set book_4_book_format 'Paperback'
\set book_4_total_pages 880
\set book_4_blurb 'Inquisitor Ravenor and his followers investigate a daemonic conspiracy that stretches across space and time in three classic novels by Dan Abnett. \n\nIn the war-torn future of the 41st millennium, the Inquisition fights a secret war against the darkest enemies of mankind – the alien, the heretic and the daemon. The three stories in this omnibus tell the tale of Inquisitor Gideon Ravenor and his lethal band of operatives, whose investigations take them from the heart of the Scarus Sector to the wildest regions of space beyond, and even through time itself. Wherever they go, and whatever dangers they face, they will never give up until their mission succeeds. \n\nContains the novels Ravenor, Ravenor Returned and Ravenor Regue, plus three short stories.'
\set book_4_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1545478110l/42641133._SY475_.jpg'

\set book_5_title 'The Magos'
\set book_5_title_sort 'magos, the'
\set book_5_published_date '2018/02/24'
\set book_5_edition_date '2018/03/06'
\set book_5_book_format 'Paperback'
\set book_5_total_pages 720
\set book_5_blurb 'Inquisitor Eisenhorn returns in a stunning new novel that pits him against his oldest foe, forcing him to finally confront the growing darkness within his own soul. \n\nInquisitor Gregor Eisenhorn has spent his life stalking the darkest and most dangerous corners of the galaxy in pursuit of heresy and Chaos, but how long can a man walk that path without succumbing to the lure of the warp? Pursuing heretics in the remote worlds of the Imperium, Eisenhorn must confront the truth about himself. Is he still a champion of the Throne? Or has he been seduced by the very evil that he hunts? The Magos is the brand new, full-length fourth novel in the hugely popular Eisenhorn series. This paperback edition also includes the definitive casebook of Gregor Eisenhorn, collecting together all twelve of Dan Abnett’s Inquisition short stories, several of which have never been in print before. These additional stories have been compiled by the author to act as an essential prologue to this long-awaited new novel, while also serving as an indispensable companion to the original Eisenhorn trilogy.'
\set book_5_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1506373817l/36304173._SY475_.jpg'

\set book_6_title 'Honourbound'
\set book_6_title_sort 'honourbound'
\set book_6_published_date '2019/02/23'
\set book_6_edition_date '2019/09/03'
\set book_6_book_format 'Paperback'
\set book_6_total_pages 496
\set book_6_blurb 'Uncompromising and fierce, Commissar Severina Raine has always served the Imperium with the utmost distinction. Attached to the Eleventh Antari Rifles, she instills order and courage in the face of utter horror. The Chaos cult, the Sighted, have swept throughout the Bale Stars and a shadow has fallen across its benighted worlds. A great campaign led by the vaunted hero Lord-General Militant Alar Serek is underway to free the system from tyranny and enslavement but the price of victory must be paid in blood. But what secrets do the Sighted harbour, secrets that might cast a light onto Raine’s own troubled past? Only by embracing her duty and staying true to her belief in the Imperium and the commissar’s creed can she hope to survive this crucible, but even then will that be enough?'
\set book_6_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1545477896l/42789259._SY475_.jpg'

\set book_7_title 'Cadia Stands'
\set book_7_title_sort 'cadia stands'
\set book_7_published_date '2017/09/23'
\set book_7_edition_date '2018/03/06'
\set book_7_book_format 'Paperback'
\set book_7_total_pages 320
\set book_7_blurb 'The brutal war for Cadia is decided, as Lord Castellan Ursarkar Creed and the armies of the Imperium fight to halt the Thirteenth Black Crusade and prevent a calamity on a galactic scale. \n\nUnder almost constant besiegement by the daemonic hosts pouring from the Eye of Terror, Cadia stands as a bulwark against tyranny and death. Its fortresses and armies have held back the hordes of Chaos for centuries, but that grim defiance is about to reach its end. As Abaddon’s Thirteenth Black Crusade batters Cadia’s defences and the armies of the Imperium flock to reinforce this crucial world, a terrible ritual long in the making comes to fruition, and the delicate balance of this brutal war shifts… From the darkness, a hero rises to lead the beleaguered defenders, Lord Castellan Ursarkar Creed, but even with the armoured might of the Astra Militarum and the strength of the Adeptus Astartes at his side, it may not be enough to avert disaster and prevent the fall of Cadia. While Creed lives, there is hope. While there is breath in the body of a single defender, Cadia Stands… but for how much longer?'
\set book_7_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1497083669l/35297654._SY475_.jpg'

\set book_8_title 'Maledictions: A Horror Anthology'
\set book_8_title_sort 'maledictions: a horror anthology'
\set book_8_published_date '2019/03/30'
\set book_8_edition_date '2019/04/02'
\set book_8_book_format 'Paperback'
\set book_8_total_pages 352
\set book_8_blurb 'A eclectic collection of gut wrenching tales to spook and scare. \n\nHorror is no stranger to the worlds of Warhammer. Its very fabric is infested with the arcane, the strange and the downright terrifying. From the cold, vastness of the 41st millenium to the creeping evil at large in the Mortal Realms, this anthology of short stories explores the sinister side of Warhammer in a way it never has been before. Psychological torment, visceral horrors, harrowing tales of the supernatural and the nightmares buried within, this collection brings together some of the best horror writing from the Black Library. \n\nFeaturing stories from Graham McNeill, Cassandra Khaw, Alec Worley, David Annandale and more.'
\set book_8_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1548642309l/40744548.jpg'

\set book_9_title 'Cadian Honour'
\set book_9_title_sort 'cadian honour'
\set book_9_published_date '2018/12/26'
\set book_9_edition_date '2019/09/17'
\set book_9_book_format 'Paperback'
\set book_9_total_pages 496
\set book_9_blurb 'Sent to the capital world of Potence, Sergeant Minka Lesk and the Cadian 101st discover that though Cadia may have fallen, their duty continues. \n\nFor ten thousand years, Cadia stood as a bastion against the daemonic tide spewing forth from the Eye of Terror. But now the Fortress World lies in ruins, its armies decimated in the wake of Abaddon the Despoiler and his Thirteenth Black Crusade. Those who survived, though haunted by the loss of their beloved homeworld, remain bloodied and unbarred, fighting ruthlessly in the Emperor’s name. \n\nAmongst them is the indomitable Sergeant Minka Lesk. Sent to the capital world of Potence, Lesk and the Cadian 101st company soon discover that a rot runs through the very heart of the seemingly peaceful world. Lesk knows she must excise this taint of Chaos, for it is not only her life and those of her company at stake, but also the honour of Cadia itself.'
\set book_9_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1552227521l/44180913.jpg'

\set book_10_title 'The Uriel Ventris Chronicles: Volume One'
\set book_10_title_sort 'uriel ventris chronicles: volume one, the'
\set book_10_published_date '2016/11/15'
\set book_10_edition_date '2019/01/08'
\set book_10_book_format 'Paperback'
\set book_10_total_pages 800
\set book_10_blurb 'The Ultramarines are a byword for loyalty and courage, their martial prowess is legendary and is second only to the God-Emperor. Graham McNeill’s epic trilogy of Ultramarines novels is a masterpiece of non-stop action! Containing the novels Nightbringer, Warriors of Ultramar and Dead Sky, Black Sun, the series follows the adventures of Space Marine Captain Uriel Ventris and the Ultramarines as they battle against the enemies of mankind. From their home world of Macragge, into the dreaded Eye of Terror and beyond, Graham McNeill’s prose rattles like gunfire and brings the Space Marines to life like never before.'
\set book_10_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1626758004l/58593308.jpg'

\set book_11_title 'The Uriel Ventris Chronicles: Volume Two'
\set book_11_title_sort 'the uriel ventris chronicles: volume two, the'
\set book_11_published_date '2016/11/15'
\set book_11_edition_date '2019/08/20'
\set book_11_book_format 'Paperback'
\set book_11_total_pages 848
\set book_11_blurb 'The second omnibus of stories featuring one of Warhammer 40,000''s most prominent characters, Ultramarine Captain Uriel Ventris. \n\nThe Ultramarines are the epitome of a Space Marine Chapter. Warriors without peer, their name is a byword for discipline and honour, and their heroic deeds are legendary. \n\nCaptain Uriel Ventris fights to prove his worth and return to the hallowed ranks of the Chapter after his exile to the Eye of Terror. But as the Iron Warriors move against Ultramar, a grim premonition comes to light: Ventris will have a part to play in the coming war... for good or ill. The ongoing story of the Uriel Ventris continues in this omnibus edition, featuring the novels The Killing Ground, Courage and Honour and The Chapter''s Due, as well as several short stories and the classic comic ''Black Bone Road''.'
\set book_11_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1561287919l/44180905.jpg'

\set book_12_title 'Iron Warriors: The Omnibus'
\set book_12_title_sort 'iron warriors: the omnibus'
\set book_12_published_date '2016/11/15'
\set book_12_edition_date '2019/08/20'
\set book_12_book_format 'Paperback'
\set book_12_total_pages 688
\set book_12_blurb 'The Iron Warriors are Chaos Space Marines with unrivalled expertise in the art of siege warfare. With great batteries of artillery and all the favours of the Ruinous Powers at their command, there is no fortress in the galaxy that can stand against them for long. \n\nThis omnibus follows the schemes of the embittered Warsmith Honsou in his struggles against the hated Space Marines of the Imperium. Drawing upon characters and events from author Graham McNeill’s popular Ultramarines series and for the first time in a single publication, Storm of Iron and the novella Iron Warrior are gathered along with short stories The Enemy of My Enemy, The Heraclitus Effect and The Skull Harvest.'
\set book_12_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1625358426l/58481729.jpg'

\set book_13_title 'The Swords of Calth'
\set book_13_title_sort 'swords of calth, the'
\set book_13_published_date '2021/02/27'
\set book_13_edition_date '2021/02/27'
\set book_13_book_format 'Hardcover'
\set book_13_total_pages 258
\set book_13_blurb 'A Uriel Ventris novel \n\nUriel Ventris returns! Newly ascended to the ranks of the Primaris Space Marines, Ventris leads the Ultramarines Fourth Company – the famed Swords of Calth – to war against the ancient necrons. Old enemies arise, as Ventris'' past and present collide in brutal battle. \n\nREAD IT BECAUSE \nOne of Black Library''s longest-running series continues – and the hero''s been given a new lease of life as a Primaris Space Marine. Discover how Ventris adapts to his new life even as his past comes back to haunt him. \n\nTHE STORY \nUriel Ventris, newly ascended to the ranks of the Primaris, leads warriors of the Fourth Company from the Indomitus Crusade of Roboute Guilliman to a world on the frontiers of Ultramar. Once a battleground against the orks, Sycorax is now under furious assault from an enemy of ancient times – the necrons. The Ultramarines have faced these baleful xenos before, but Uriel senses the hand of a foe from his past at work on Sycorax, a tally unfinished and a debt to the Imperium finally come due. \n\nTrapped deep in a devastated city, Uriel leads the Swords of Calth into battle, and must adapt to his new incarnation as one of the Primaris – a challenge that will test his soul as much as it will test him as a warrior.'
\set book_13_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1628695156l/58749658._SY475_.jpg'

\set book_14_title 'Warden of the Blade'
\set book_14_title_sort 'warden of the blade'
\set book_14_published_date '2016/11/12'
\set book_14_edition_date '2018/01/23'
\set book_14_book_format 'Paperback'
\set book_14_total_pages 320
\set book_14_blurb 'The noble Castellan Crowe of the Grey Knights Chapter must wield the cursed Blade of Antwyr, an indestructable weapon imbued with evil daemonic power. \n\nCastellan Crowe, Brotherhood Champion of the Purifier order of the Grey Knights, bears a heavy burden – to be the warden of the dread Blade of Antwyr. Its malevolent voice is forever in his head, trying to crack his resolve, urging him to unleash a power he must never use. The toll is terrible – how long before the incorruptible Crowe is at last defeated? Under the command of Castellan Gavallan, Crowe and his brother Purifiers bring purging flame to a daemonic incursion that threatens to consume the world of Sandava I. However, what awaits them there is more insidious and more powerful than they imagine, and they must reckon too with the machinations of the Blade, as it seeks to destroy its guardian and drown the galaxy in blood.'
\set book_14_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1497084986l/34466775._SY475_.jpg'

\set book_15_title 'Deathwatch'
\set book_15_title_sort 'deathwatch'
\set book_15_published_date '2013/04/11'
\set book_15_edition_date '2019/10/15'
\set book_15_book_format 'Paperback'
\set book_15_total_pages 512
\set book_15_blurb 'Action packed novel featuring the galaxies foremost alien hunting taskforce, the Deathwatch. Led by Librarian Karras, the elite alien-hunting Talon Squad must penetrate a genestealer lair and put the abominations to the flame or face the consequences of an entire planet''s extinction. \n\nGathered from the many Chapters of Space Marines, the Deathwatch are elite, charged with defending the Imperium of Man from aliens. Six Space Marines, strangers from different words, make up Talon Squad. On 31-Caro, a new terror has emerged, a murderous shadow that stalks the dark, and only the Deathwatch can stop it. Under the direction of a mysterious Inquisitor Lord known only as Sigma, they must cleanse this planet or die in the attempt.'
\set book_15_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1561288604l/52357292._SX318_SY475_.jpg'

\set book_16_title 'The Carrion Throne'
\set book_16_title_sort 'carrion throne, the'
\set book_16_published_date '2017/04/05'
\set book_16_edition_date '2018/05/18'
\set book_16_book_format 'Paperback'
\set book_16_total_pages 384
\set book_16_blurb 'Inquisitor Erasmus Crowl and his acolyte Spinoza follow the trail of a shadowy conspiracy on Holy Terra itself, the capital world of the Imperium. \n\nIn the hellish sprawl of Imperial Terra, Ordo Hereticus Inquisitor Erasmus Crowl serves as a stalwart and vigilant protector, for even the Throneworld is not immune to the predations of its enemies. In the course of his Emperor-sworn duty, Crowl becomes embroiled in a dark conspiracy, one that leads all the way to the halls of the Imperial Palace. As he plunges deeper into the shadowy underbelly of the many palace districts, his investigation attracts the attention of hidden forces, and soon he and his acolyte Spinoza are being hunted – by heretics, xenos, servants of the Dark Powers, or perhaps even rival elements of the Inquisition itself. Soon they discover a terrible truth, one that if allowed to get out could undermine the very fabric of the Imperium itself.'
\set book_16_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1507457967l/36373739._SY475_.jpg'

\set book_17_title 'The Hollow Mountain'
\set book_17_title_sort 'hollow mountain, the'
\set book_17_published_date '2019/07/20'
\set book_17_edition_date '2020/02/04'
\set book_17_book_format 'Paperback'
\set book_17_total_pages 352
\set book_17_blurb 'Book 2 in the Vaults of Terra mini-series. Discover what happens when Chaos comes to the Throneworld itself for the first time in ten millennia..... \n\nInquisitor Erasmus Crowl has discovered a terrible plot, its roots firmly planted in the very highest levels of Terra. Pursuing it is fraught with risk, but Crowl’s sense of duty compels him to persevere. He and his acolyte Spinoza run down their leads in secret, knowing that their every move invites danger, but even as they begin to reveal the truth, a greater peril is unfolding in the skies – the Great Rift is becoming manifest. During the madness that threatens to tear Terra asunder, Crowl’s Inquisitorial base of operations comes under attack and is badly ravaged. As his world begins to unravel and a new, bloody age dawns, can Crowl stay true to his course and expose the horror that lies at the heart of the Hollow Mountain?'
\set book_17_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1563199563l/51086449._SX318_SY475_.jpg'

\set book_18_title 'Kingsblade'
\set book_18_title_sort 'kingsblade'
\set book_18_published_date '2017/02/01'
\set book_18_edition_date '2017/08/22'
\set book_18_book_format 'Paperback'
\set book_18_total_pages 368
\set book_18_blurb 'Imperial Knight Titans clash as an internecine war ravages the Knights of Adrastapol. \n\nThe Knight Houses of Adrastapol are both noble and righteous, and when the Imperial world of Donatos falls to the heresy of the Word Bearers, they are foremost in the vanguard to retake it. Led by High King Tolwyn Draconis, the Knights are peerless in battle and strike deep into the enemy’s ranks. But the war soon turns when a terrible tragedy strikes, casting the Imperial campaign into anarchy. As desperation grows, unblooded Knights Errant Danial and Luk must quickly learn the ways of war to prevent an unholy ritual, or Donatos will be lost and all the noble Houses of Adrastapol with it.'
\set book_18_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1478803265l/32902466.jpg'

\set book_19_title 'Blood Angels: The Complete Rafen Omnibus'
\set book_19_title_sort 'blood angels: the complete rafen omnibus'
\set book_19_published_date '2019/01/19'
\set book_19_edition_date '2019/01/19'
\set book_19_book_format 'Paperback'
\set book_19_total_pages 828
\set book_19_blurb 'This omnibus edition collects together for the first time the four Blood Angels novels of author James Swallow and includes several bonus short stories. The full story of Blood Angels Brother Rafen. From humble battle-brother to war-hardened sergeant, Rafen survives civil war, Chaos plots and the calling of destiny in four novels by James Swallow. \n\nIn this epic tale of brotherhood and darkness, the Blood Angels face strife from within when Brother Arkio claims to be a reincarnation of Sanguinius, the Blood Angels’ spiritual father. His message is clear: follow me or die. With no other choice, his brother Rafen kneels before this prophet of the Blood and swears an oath of devotion. But in his heart, Rafen knows that Arkio cannot be allowed to lead the Chapter into darkness. A reckoning is coming, one that they will not both survive. As the ashes settle on the devastating by civil war, the Blood Angels face a dire crisis and must call together their Successor Chapters or face extinction. But the sons of Sanguinius have many enemies, and this audacious scheme to rebuild their ranks comes under threat by the machinations of the arch-traitor Fabius Bile.'
\set book_19_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1587322079l/53208413.jpg'

\set book_20_title 'Belisarius Cawl: The Great Work'
\set book_20_title_sort 'belisarius cawl: the great work'
\set book_20_published_date '2019/09/21'
\set book_20_edition_date '2020/03/17'
\set book_20_book_format 'Paperback'
\set book_20_total_pages 416
\set book_20_blurb 'Warhammer 40,000 fans rejoice - Belisarius Cawl has his own novel! Join him on his journey to the abandoned world of Sotha which hides a long-buried secret… and an ancient evil. \n\nBelisarius Cawl, Archmagos Dominus of the Adeptus Mechanicus is the most brilliant mind alive. For 10,000 years he has furthered the cause of mankind, working under the aegis of the Emperor and Lord Commander Roboute Guilliman to prevent the inexorable march of the alien and the traitor. Many call him heretic, but all must recognise the magnitude of his achievements, for who else but he was entrusted to create a new generation of Space Marines? Who else but the great Belisarius Cawl could even accomplish such a task? \n\nNow, in the wake of the Great Rift and the Indomitus Crusade, his ambitions bring him to the long-dead world of Sotha, once home to the Scythes of the Emperor, now a barren wasteland devoured by the vile Tyranids. Accompanied by Tetrarch Felix and his elite warriors, it is here that Cawl believes the lynchpin of his mysterious Great Work lies. But uncovering it is a near impossible task, one in which the Archmagos must overcome an ancient evil that threatens to extinguish the last hope of humanity.'
\set book_20_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1562505193l/51085980._SX318_SY475_.jpg'

\set book_21_title 'Deathwatch: The Omnibus'
\set book_21_title_sort 'deathwatch: the omnibus'
\set book_21_published_date '2017/11/28'
\set book_21_edition_date '2017/11/28'
\set book_21_book_format 'Paperback'
\set book_21_total_pages 960
\set book_21_blurb 'New omnibus of novels and short stories featuring the Deathwatch, alien-hunting Space Marines who undertake special ops-style missions in the 41st millennium. \n\nThe Deathwatch are the elite. Recruited from numerous Space Marine Chapters, their mission is simple: exterminate any xenos threat to the Imperium. Assembled into kill-teams, the Deathwatch are expert alien hunters, equipped to undertake any mission in any environment. None are as dedicated or as skilled in the brutal art of alien annihilation. This action-packed omnibus contains three separate novels written by Steve Parker, Ian St Martin and Justin D Hill, along with a dozen of the best short stories ever written about the Imperium''s premier xenos hunters.'
\set book_21_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1502692222l/34466780.jpg'

\set book_22_title 'Sagas of the Space Wolves: The Omnibus'
\set book_22_title_sort 'sagas of the space wolves: the omnibus'
\set book_22_published_date '2020/03/28'
\set book_22_edition_date '2020/03/31'
\set book_22_book_format 'Paperback'
\set book_22_total_pages 944
\set book_22_blurb 'Bumper Omnibus collecting together some of Black Library''s most loved Space Wolves stories for the first time. \n\nBorn on the icy world of Fenris, few amongst the brotherhoods of the Adeptus Astartes are as fierce or as noble as the Space Wolves. Long are their tales, told around mead halls or the flickering glow of a hungry fire. Heed them well, for they speak of legends like the Young King Ragnar Blackmane, whose thirst for battle is only matched by his heroism, or the Wolf Lord Logan Grimnar that most venerable and fearsome of warriors, he who leads the Chapter itself. So listen hard and listen carefully to the skald as he holds forth around the burning fire, because there is darkness in these sagas as well as light. \n\nThis omnibus edition collects together for the first time the novels Ragnar Blackmane, Curse of the Wulfen, Legacy of Russ and The Hunt for Logan Grimnar as well as the novellas Blood on the Mountain and Arjac Rockfist, and a host of short stories.'
\set book_22_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1580054595l/51085946._SX318_SY475_.jpg'

\set book_23_title 'Infernal Requiem'
\set book_23_title_sort 'infernal requiem'
\set book_23_published_date '2019/04/13'
\set book_23_edition_date '2019/10/15'
\set book_23_book_format 'Paperback'
\set book_23_total_pages 400
\set book_23_blurb 'An Adepta Sororitas novel \n\nOn a distant world, an obscure order of the Adepta Sororitas study their founder''s visions. They live in solitude… which is about to be broken as danger approaches. \n\nREAD IT BECAUSE \nPeter Fehervari brings a tale of an unusual order of the Sisters of Battle, a sister breaking her self-imposed exile and an Astra Militarum unit seeking respite from their woes… and it''s every bit as weird and wonderful as you''d hope. \n\nTHE STORY \nThe Adepta Sororitas of the Last Candle have stood vigil over their sanctuary world for centuries, striving to decipher their founder''s tormented visions. Outsiders are unwelcome… yet still they come. \n\nDecimated by an encounter with a lethal xenos entity, the survivors of an elite Astra Militarum company have journeyed to the Candleworld in search of healing, escorted by a woman who is no stranger there – Sister Hospitaller Asenath Hyades, who turned her back on the order decades ago. \n\nAs the seekers near the sect''s bastion, malign forces begin to stir among the planet''s storm-wracked spires, but the most insidious shadows lie in their own souls.'
\set book_23_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1572780052l/44180899._SY475_.jpg'

\set book_24_title 'Dark Imperium'
\set book_24_title_sort 'dark imperium'
\set book_24_published_date '2017/06/23'
\set book_24_edition_date '2021/05/29'
\set book_24_book_format 'Hardcover'
\set book_24_total_pages 322
\set book_24_blurb 'A Warhammer 40,000 novel \nThe galaxy has changed. Darkness spreads, warp storms split reality and Chaos is everywhere – even Ultramar. As Roboute Guilliman''s Indomitus Crusade draws to a close, he must brave the perils of the warp to reach his home and save it from the depredations of the Plague God. \n\nTHE STORY \nFell times have come to the galaxy. Cadia has fallen, destroyed by the onslaught of Chaos. A Great Rift in the warp has opened and from its depths spew daemons and the horrors of Old Night. But all hope is not lost... A hero, long absent, has returned and with him comes the wrath of the Ultramarines reborn. Roboute Guilliman has arisen to lead the Imperium out of darkness on a crusade the likes of which has not been seen since the fabled days of the Emperor. But never before have the forces of Ruin amassed in such numbers, and nowhere is safe from despoliation. From the dreaded Scourge Stars come the hordes of the Plaguefather, Lord Nurgle, and their pustulent eye is fixed on Macragge. As the Indomitas Crusade draws to an end, Guilliman races to Ultramar and a confrontation with the Death Guard.'
\set book_24_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1634956122l/59433670.jpg'

\set book_25_title 'Plague War'
\set book_25_title_sort 'plague war'
\set book_25_published_date '2018/10/13'
\set book_25_edition_date '2021/05/29'
\set book_25_book_format 'Hardcover'
\set book_25_total_pages 322
\set book_25_blurb 'Intent on rebuilding Ultramar, the returned primarch Roboute Guilliman wages war on the treacherous Death Guard – but the intervention of a greater power threatens all he works for. \n\nIn the void and upon the worlds of Greater Ultramar, the battle for the Imperium continues. \n\nIntent on rebuilding his home realm and using it as base to reconstruct the ravaged stellar empire of mankind, the returned primarch Roboute Guilliman proceeds with his war to drive Mortarion and his Death Guard Traitor Legion from the domain of the Ultramarines. \n\nBut when Guilliman brings his brother to battle upon the diseased plains of Parmenio, the intervention of a greater power in their fraternal struggle threatens to upend the Imperial Regent’s understanding of the galaxy, and his place within it. \n\nPrimarchs and ideologies clash in this second, thrilling part of the Dark Imperium trilogy.'
\set book_25_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1634957079l/59433720.jpg'

\set book_26_title 'Godblight'
\set book_26_title_sort 'godblight'
\set book_26_published_date '2021/05/29'
\set book_26_edition_date '2021/05/29'
\set book_26_book_format 'Hardcover'
\set book_26_total_pages 369
\set book_26_blurb 'Book 3 of the Dark Imperium trilogy \n\nThe destinies of primarch and Imperial Regent Roboute Guilliman and his traitorous brother Mortarion come together for the climactic battle of the Plague Wars. \n\nREAD IT BECAUSE \nIt''s the throwdown you''ve been waiting for, as Guilliman and Mortarion work out ten thousand years of pent-up resentment in a clash for the ages. \n\nTHE STORY \nThe paths of Roboute Guilliman and his fallen brother Mortarion bring them inexorably together on Iax. Once a jewel of the Imperium, the garden world is dying as the plans of the Lord of Death to use it as a fulcrum to drag the stellar realm of Ultramar into the warp come to deadly fruition. \n\nWhile Guilliman attempts to prevent the destruction of his kingdom, Mortarion schemes to bring his brother low with the Godblight, a disease created in the Cauldron of Nurgle itself, made with the power to destroy a son of the Emperor. \n\nPrimarchs clash on the ravaged landscapes of Iax. The gods go to war and the wider galaxy balances on a knife-edge of destruction. As something powerful stirs in the sea of souls, only one thing is certain – no matter who wins the last great clash of the Plague War, the repercussions of victory will echo through eternity…'
\set book_26_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1622242933l/58189507._SY475_.jpg'

\set book_27_title 'Knights of Macragge'
\set book_27_title_sort 'knights of macragge'
\set book_27_published_date '2021/01/21'
\set book_27_edition_date '2021/01/21'
\set book_27_book_format 'Paperback'
\set book_27_total_pages 432
\set book_27_blurb 'The return of Captain Sicarius! Discover what befell Sicarius when he was lost in the warp, and how he survived. \n\nThe primarch Roboute Guilliman of the Ultramarines has returned in the galaxy’s hour of need, and all muster to his Indomitus Crusade to hold back the darkness. Amongst these heroes is Cato Sicarius, Master of the Watch and vaunted captain of Second Company. Disaster befalls Sicarius and his brave warriors as their ship, the Emperor’s Will, is lost to the hellish warp, its entire crew believed slain. But Sicarius endures, though he and his men are fighting for their very survival against the denizens of the Great Rift – the daemons and renegades of Chaos. Cast adrift and war-weary, hope appears too distant to grasp until the storm breaks at last and a strange world beckons. As the captain and a band of his chosen warriors descend to the surface seeking aid, they find an isolated land seemingly from an ancient era, one plagued by a terrible enemy. Sicarius will not see this world suffer, and pledges his warriors to the world’s cause, determined to save it, whatever the cost… But what is the dark secret harboured here, and what will it mean for the Ultramarines if they uncover it?'
\set book_27_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1562505171l/51086035._SX318_SY475_.jpg'

\set book_28_title 'Indomitus'
\set book_28_title_sort 'indomitus'
\set book_28_published_date '2020/08/04'
\set book_28_edition_date '2020/08/04'
\set book_28_book_format 'Hardcover'
\set book_28_total_pages 384
\set book_28_blurb 'The Indomitus Crusade begins! \n\nFor nearly ten years, the Indomitus Crusade has waged a war of defiance and reconquest in the war-torn Imperium. Attached to Crusade Fleet Quintus – dubbed the Cursed Fleet by many – the Ultramarines of the Ithraca’s Vengeance are drawn to a stricken world. With millions enslaved, a malign necron technology siphons the souls of the innocent and heralds the Silent Kingdom’s expansion. The Ultramarines face an impossible decision: mount a desperate last stand to destroy the Pariah Nexus, or break away and damn the entire sector to bring word of this ancient foe’s resurgence to the only being capable of halting it – the Lord Primarch Roboute Guilliman.'
\set book_28_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1594563237l/54482281.jpg'

\set book_29_title 'Mark of Faith'
\set book_29_title_sort 'mark of faith'
\set book_29_published_date '2020/05/26'
\set book_29_edition_date '2020/05/26'
\set book_29_book_format 'Paperback'
\set book_29_total_pages 400
\set book_29_blurb 'At long last - the Adepta Sororitas are back! \n\nWith the birth of the Cicatrix Maledictum the Imperium of Mankind suffers as never before. Conflict and corruption is rife on every front and precious little hope remains, save for those who hold to their faith when faced with destruction... \n\nDenied a martyr’s death during the battle for Ophelia VII, Sister Evangeline of the Order of Our Martyred Lady is blessed with a new and grave duty; to embark on a pilgrimage beyond the Great Rift to recover a precious and powerful artefact – the Shield of Saint Katherine. Accompanied by the enigmatic Inquisitor Ravara, who seeks her own closure in the veiled regions beyond the Rift, Evangeline must find a way to bear the weight of this unaskedfor destiny if she and her Sisters are to succeed in restoring a fragment of light to this new dark Imperium.'
\set book_29_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1639506437l/59824608.jpg'

\set book_30_title 'Ghost Warrior'
\set book_30_title_sort 'ghost warrior'
\set book_30_published_date '2018/05/15'
\set book_30_edition_date '2018/05/15'
\set book_30_book_format 'Paperback'
\set book_30_total_pages 368
\set book_30_blurb 'When the long-lost craftworld Ziasuthra reappears, Iyanna Arienal and Yvraine of the Ynnari lead an expedition to it in hope of retrieving the last cronesword. \n\nStill reeling from the advent of the Great Rift and the ravages of the tyranids, the aeldari inhabitants of Iyanden are shocked when they receive a message from a long-lost craftworld. Missing for millennia, the craftworld of Ziasuthra has suddenly reappeared from its sanctuary in the warp, and its denizens wish to make contact. Led by the Spiritseer Iyanna and Yvraine, the Emissary of Ynnead, a small force of craftworld aeldari head to Ziasuthra to open negotiations with their brethren. Behind their surface desire to help, however, Iyanna and Yvraine have a stronger motive: they are seeking the final cronesword, which could lie hidden behind ancient web portal on this craftworld. But how co-operative will the mysterious Ziasuthrans prove to be, or do they too have their own agenda?'
\set book_30_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1507458237l/36373747._SY475_.jpg'

\set book_31_title 'Wild Rider'
\set book_31_title_sort 'wild rider'
\set book_31_published_date '2018/11/10'
\set book_31_edition_date '2018/11/10'
\set book_31_book_format 'Paperback'
\set book_31_total_pages 384
\set book_31_blurb 'The Wild Riders of Saim Hann craftworld are renowned for their skill and daring, none more so than their headstrong Wild Lord, Nuadhu Fireheart. Having been approached by a representative of Yvraine, emissary of the Whispering God, Ynnead, Nuadhu has unwittingly awoken a slumbering threat – a tomb world of the aeons-old necrontyr. Now, Clan Fireheart must seek alliance with the Ynnari in order to combat the threat to their craftworld, and preserve their honour and the future of the family. The two forces return to Agarimethea to destroy the necrontyr before their strength becomes unassailable. But for what other purpose does Yvraine accompany Nuadhu and his kin, and what exactly is her interest in Naiall Fireheart, the ailing chieftain of the clan?'
\set book_31_book_cover_url 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1541808156l/42740946._SY475_.jpg'

-- INSERT book using previously declared variables
SELECT insert_book(:'book_1_title', :'book_1_title_sort', :'book_1_published_date', :'book_1_edition_date', :'book_1_book_format', :'book_1_total_pages', :'book_1_blurb', :'book_1_book_cover_url');
SELECT insert_book(:'book_2_title', :'book_2_title_sort', :'book_2_published_date', :'book_2_edition_date', :'book_2_book_format', :'book_2_total_pages', :'book_2_blurb', :'book_2_book_cover_url');
SELECT insert_book(:'book_3_title', :'book_3_title_sort', :'book_3_published_date', :'book_3_edition_date', :'book_3_book_format', :'book_3_total_pages', :'book_3_blurb', :'book_3_book_cover_url');
SELECT insert_book(:'book_4_title', :'book_4_title_sort', :'book_4_published_date', :'book_4_edition_date', :'book_4_book_format', :'book_4_total_pages', :'book_4_blurb', :'book_4_book_cover_url');
SELECT insert_book(:'book_5_title', :'book_5_title_sort', :'book_5_published_date', :'book_5_edition_date', :'book_5_book_format', :'book_5_total_pages', :'book_5_blurb', :'book_5_book_cover_url');
SELECT insert_book(:'book_6_title', :'book_6_title_sort', :'book_6_published_date', :'book_6_edition_date', :'book_6_book_format', :'book_6_total_pages', :'book_6_blurb', :'book_6_book_cover_url');
SELECT insert_book(:'book_7_title', :'book_7_title_sort', :'book_7_published_date', :'book_7_edition_date', :'book_7_book_format', :'book_7_total_pages', :'book_7_blurb', :'book_7_book_cover_url');
SELECT insert_book(:'book_8_title', :'book_8_title_sort', :'book_8_published_date', :'book_8_edition_date', :'book_8_book_format', :'book_8_total_pages', :'book_8_blurb', :'book_8_book_cover_url');
SELECT insert_book(:'book_9_title', :'book_9_title_sort', :'book_9_published_date', :'book_9_edition_date', :'book_9_book_format', :'book_9_total_pages', :'book_9_blurb', :'book_9_book_cover_url');
SELECT insert_book(:'book_10_title', :'book_10_title_sort', :'book_10_published_date', :'book_10_edition_date', :'book_10_book_format', :'book_10_total_pages', :'book_10_blurb', :'book_10_book_cover_url');
SELECT insert_book(:'book_11_title', :'book_11_title_sort', :'book_11_published_date', :'book_11_edition_date', :'book_11_book_format', :'book_11_total_pages', :'book_11_blurb', :'book_11_book_cover_url');
SELECT insert_book(:'book_12_title', :'book_12_title_sort', :'book_12_published_date', :'book_12_edition_date', :'book_12_book_format', :'book_12_total_pages', :'book_12_blurb', :'book_12_book_cover_url');
SELECT insert_book(:'book_13_title', :'book_13_title_sort', :'book_13_published_date', :'book_13_edition_date', :'book_13_book_format', :'book_13_total_pages', :'book_13_blurb', :'book_13_book_cover_url');
SELECT insert_book(:'book_14_title', :'book_14_title_sort', :'book_14_published_date', :'book_14_edition_date', :'book_14_book_format', :'book_14_total_pages', :'book_14_blurb', :'book_14_book_cover_url');
SELECT insert_book(:'book_15_title', :'book_15_title_sort', :'book_15_published_date', :'book_15_edition_date', :'book_15_book_format', :'book_15_total_pages', :'book_15_blurb', :'book_15_book_cover_url');
SELECT insert_book(:'book_16_title', :'book_16_title_sort', :'book_16_published_date', :'book_16_edition_date', :'book_16_book_format', :'book_16_total_pages', :'book_16_blurb', :'book_16_book_cover_url');
SELECT insert_book(:'book_17_title', :'book_17_title_sort', :'book_17_published_date', :'book_17_edition_date', :'book_17_book_format', :'book_17_total_pages', :'book_17_blurb', :'book_17_book_cover_url');
SELECT insert_book(:'book_18_title', :'book_18_title_sort', :'book_18_published_date', :'book_18_edition_date', :'book_18_book_format', :'book_18_total_pages', :'book_18_blurb', :'book_18_book_cover_url');
SELECT insert_book(:'book_19_title', :'book_19_title_sort', :'book_19_published_date', :'book_19_edition_date', :'book_19_book_format', :'book_19_total_pages', :'book_19_blurb', :'book_19_book_cover_url');
SELECT insert_book(:'book_20_title', :'book_20_title_sort', :'book_20_published_date', :'book_20_edition_date', :'book_20_book_format', :'book_20_total_pages', :'book_20_blurb', :'book_20_book_cover_url');
SELECT insert_book(:'book_21_title', :'book_21_title_sort', :'book_21_published_date', :'book_21_edition_date', :'book_21_book_format', :'book_21_total_pages', :'book_21_blurb', :'book_21_book_cover_url');
SELECT insert_book(:'book_22_title', :'book_22_title_sort', :'book_22_published_date', :'book_22_edition_date', :'book_22_book_format', :'book_22_total_pages', :'book_22_blurb', :'book_22_book_cover_url');
SELECT insert_book(:'book_23_title', :'book_23_title_sort', :'book_23_published_date', :'book_23_edition_date', :'book_23_book_format', :'book_23_total_pages', :'book_23_blurb', :'book_23_book_cover_url');
SELECT insert_book(:'book_24_title', :'book_24_title_sort', :'book_24_published_date', :'book_24_edition_date', :'book_24_book_format', :'book_24_total_pages', :'book_24_blurb', :'book_24_book_cover_url');
SELECT insert_book(:'book_25_title', :'book_25_title_sort', :'book_25_published_date', :'book_25_edition_date', :'book_25_book_format', :'book_25_total_pages', :'book_25_blurb', :'book_25_book_cover_url');
SELECT insert_book(:'book_26_title', :'book_26_title_sort', :'book_26_published_date', :'book_26_edition_date', :'book_26_book_format', :'book_26_total_pages', :'book_26_blurb', :'book_26_book_cover_url');
SELECT insert_book(:'book_27_title', :'book_27_title_sort', :'book_27_published_date', :'book_27_edition_date', :'book_27_book_format', :'book_27_total_pages', :'book_27_blurb', :'book_27_book_cover_url');
SELECT insert_book(:'book_28_title', :'book_28_title_sort', :'book_28_published_date', :'book_28_edition_date', :'book_28_book_format', :'book_28_total_pages', :'book_28_blurb', :'book_28_book_cover_url');
SELECT insert_book(:'book_29_title', :'book_29_title_sort', :'book_29_published_date', :'book_29_edition_date', :'book_29_book_format', :'book_29_total_pages', :'book_29_blurb', :'book_29_book_cover_url');
SELECT insert_book(:'book_30_title', :'book_30_title_sort', :'book_30_published_date', :'book_30_edition_date', :'book_30_book_format', :'book_30_total_pages', :'book_30_blurb', :'book_30_book_cover_url');
SELECT insert_book(:'book_31_title', :'book_31_title_sort', :'book_31_published_date', :'book_31_edition_date', :'book_31_book_format', :'book_31_total_pages', :'book_31_blurb', :'book_31_book_cover_url');


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
SELECT insert_reader_book(:'username_1', :'book_19_title');
SELECT insert_reader_book(:'username_1', :'book_20_title');
SELECT insert_reader_book(:'username_1', :'book_21_title');
SELECT insert_reader_book(:'username_1', :'book_22_title');
SELECT insert_reader_book(:'username_1', :'book_23_title');
SELECT insert_reader_book(:'username_1', :'book_24_title');
SELECT insert_reader_book(:'username_1', :'book_25_title');
SELECT insert_reader_book(:'username_1', :'book_26_title');
SELECT insert_reader_book(:'username_1', :'book_27_title');
SELECT insert_reader_book(:'username_1', :'book_28_title');
SELECT insert_reader_book(:'username_1', :'book_29_title');
SELECT insert_reader_book(:'username_1', :'book_30_title');
SELECT insert_reader_book(:'username_1', :'book_31_title');


/* --------------------------------------------- INSERT read_instance --------------------------------------------- */
-- FUNCTION insert_read_instance
CREATE OR REPLACE FUNCTION insert_read_instance(arg_username VARCHAR, arg_book_title VARCHAR)
RETURNS VOID AS $$
DECLARE
  var_reader_book_id INT = get_reader_book_id($1, $2);
BEGIN
  INSERT INTO read_instance (reader_book_id)
  VALUES (var_reader_book_id);
END;
$$ LANGUAGE plpgsql;

-- INSERT relationship between reader_book and read_instance
SELECT insert_read_instance(:'username_1', :'book_1_title');
SELECT insert_read_instance(:'username_1', :'book_2_title');
SELECT insert_read_instance(:'username_1', :'book_3_title');
SELECT insert_read_instance(:'username_1', :'book_4_title');
SELECT insert_read_instance(:'username_1', :'book_5_title');
SELECT insert_read_instance(:'username_1', :'book_6_title');
SELECT insert_read_instance(:'username_1', :'book_7_title');
SELECT insert_read_instance(:'username_1', :'book_8_title');
SELECT insert_read_instance(:'username_1', :'book_9_title');
SELECT insert_read_instance(:'username_1', :'book_10_title');
SELECT insert_read_instance(:'username_1', :'book_11_title');
SELECT insert_read_instance(:'username_1', :'book_12_title');
SELECT insert_read_instance(:'username_1', :'book_13_title');
SELECT insert_read_instance(:'username_1', :'book_14_title');
SELECT insert_read_instance(:'username_1', :'book_15_title');
SELECT insert_read_instance(:'username_1', :'book_16_title');
SELECT insert_read_instance(:'username_1', :'book_17_title');
SELECT insert_read_instance(:'username_1', :'book_18_title');
SELECT insert_read_instance(:'username_1', :'book_19_title');
SELECT insert_read_instance(:'username_1', :'book_20_title');
SELECT insert_read_instance(:'username_1', :'book_21_title');
SELECT insert_read_instance(:'username_1', :'book_22_title');
SELECT insert_read_instance(:'username_1', :'book_23_title');
SELECT insert_read_instance(:'username_1', :'book_24_title');
SELECT insert_read_instance(:'username_1', :'book_25_title');
SELECT insert_read_instance(:'username_1', :'book_26_title');
SELECT insert_read_instance(:'username_1', :'book_27_title');
SELECT insert_read_instance(:'username_1', :'book_28_title');
SELECT insert_read_instance(:'username_1', :'book_29_title');
SELECT insert_read_instance(:'username_1', :'book_30_title');
SELECT insert_read_instance(:'username_1', :'book_31_title');


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
  var_read_instance_id INT = get_read_instance_id($1, $2);
BEGIN
  INSERT INTO read_entry (date_read, pages_read, current_page, current_percent, read_instance_id)
  VALUES ($3, $4, $5, $6, var_read_instance_id);
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
SELECT insert_read_entry(:'username_1', :'book_18_title', '2021-09-02', 55, 55, 14.95);
SELECT insert_read_entry(:'username_1', :'book_18_title', '2021-09-03', 54, 109, 29.62);
SELECT insert_read_entry(:'username_1', :'book_18_title', '2021-09-04', 56, 165, 44.84);
SELECT insert_read_entry(:'username_1', :'book_18_title', '2021-09-05', 56, 221, 60.05);
SELECT insert_read_entry(:'username_1', :'book_18_title', '2021-09-06', 147, 368, 100);

-- INSERT book_19
SELECT insert_read_entry(:'username_1', :'book_19_title', '2021-09-07', 41, 41, 4.95);
SELECT insert_read_entry(:'username_1', :'book_19_title', '2021-09-08', 36, 77, 9.3);
SELECT insert_read_entry(:'username_1', :'book_19_title', '2021-09-09', 46, 123, 14.86);
SELECT insert_read_entry(:'username_1', :'book_19_title', '2021-09-10', 36, 159, 19.2);
SELECT insert_read_entry(:'username_1', :'book_19_title', '2021-09-11', 52, 211, 25.48);
SELECT insert_read_entry(:'username_1', :'book_19_title', '2021-09-12', 48, 259, 31.28);
SELECT insert_read_entry(:'username_1', :'book_19_title', '2021-09-13', 60, 319, 38.53);
SELECT insert_read_entry(:'username_1', :'book_19_title', '2021-09-14', 90, 409, 49.4);
SELECT insert_read_entry(:'username_1', :'book_19_title', '2021-09-15', 36, 445, 53.74);
SELECT insert_read_entry(:'username_1', :'book_19_title', '2021-09-16', 58, 503, 60.75);
SELECT insert_read_entry(:'username_1', :'book_19_title', '2021-09-17', 78, 581, 70.17);
SELECT insert_read_entry(:'username_1', :'book_19_title', '2021-09-18', 64, 645, 77.9);
SELECT insert_read_entry(:'username_1', :'book_19_title', '2021-09-19', 60, 705, 85.14);
SELECT insert_read_entry(:'username_1', :'book_19_title', '2021-09-20', 123, 828, 100);

-- INSERT book_20
SELECT insert_read_entry(:'username_1', :'book_20_title', '2021-09-21', 35, 35, 8.41);
SELECT insert_read_entry(:'username_1', :'book_20_title', '2021-09-22', 56, 91, 21.88);
SELECT insert_read_entry(:'username_1', :'book_20_title', '2021-09-23', 58, 149, 35.82);
SELECT insert_read_entry(:'username_1', :'book_20_title', '2021-09-24', 46, 195, 46.88);
SELECT insert_read_entry(:'username_1', :'book_20_title', '2021-09-25', 52, 247, 59.38);
SELECT insert_read_entry(:'username_1', :'book_20_title', '2021-09-26', 60, 307, 73.8);
SELECT insert_read_entry(:'username_1', :'book_20_title', '2021-09-27', 52, 359, 86.3);
SELECT insert_read_entry(:'username_1', :'book_20_title', '2021-09-28', 57, 416, 100);

-- INSERT book_21
SELECT insert_read_entry(:'username_1', :'book_21_title', '2021-09-29', 49, 49, 5.1);
SELECT insert_read_entry(:'username_1', :'book_21_title', '2021-09-30', 52, 101, 10.52);
SELECT insert_read_entry(:'username_1', :'book_21_title', '2021-10-01', 51, 152, 15.83);
SELECT insert_read_entry(:'username_1', :'book_21_title', '2021-10-02', 48, 200, 20.83);
SELECT insert_read_entry(:'username_1', :'book_21_title', '2021-10-03', 52, 252, 26.25);
SELECT insert_read_entry(:'username_1', :'book_21_title', '2021-10-04', 49, 301, 31.35);
SELECT insert_read_entry(:'username_1', :'book_21_title', '2021-10-05', 49, 350, 36.46);
SELECT insert_read_entry(:'username_1', :'book_21_title', '2021-10-06', 45, 395, 41.15);
SELECT insert_read_entry(:'username_1', :'book_21_title', '2021-10-07', 64, 459, 47.81);
SELECT insert_read_entry(:'username_1', :'book_21_title', '2021-10-08', 48, 507, 52.81);
SELECT insert_read_entry(:'username_1', :'book_21_title', '2021-10-09', 52, 559, 58.23);
SELECT insert_read_entry(:'username_1', :'book_21_title', '2021-10-10', 52, 611, 63.65);
SELECT insert_read_entry(:'username_1', :'book_21_title', '2021-10-11', 52, 663, 69.06);
SELECT insert_read_entry(:'username_1', :'book_21_title', '2021-10-12', 38, 701, 73.02);
SELECT insert_read_entry(:'username_1', :'book_21_title', '2021-10-13', 101, 802, 83.54);
SELECT insert_read_entry(:'username_1', :'book_21_title', '2021-10-14', 105, 907, 94.48);
SELECT insert_read_entry(:'username_1', :'book_21_title', '2021-10-15', 53, 960, 100);

-- INSERT book_22
SELECT insert_read_entry(:'username_1', :'book_22_title', '2021-10-16', 51, 51, 5.4);
SELECT insert_read_entry(:'username_1', :'book_22_title', '2021-10-17', 84, 135, 14.3);
SELECT insert_read_entry(:'username_1', :'book_22_title', '2021-10-18', 74, 209, 22.14);
SELECT insert_read_entry(:'username_1', :'book_22_title', '2021-10-19', 44, 253, 26.8);
SELECT insert_read_entry(:'username_1', :'book_22_title', '2021-10-20', 43, 296, 31.36);
SELECT insert_read_entry(:'username_1', :'book_22_title', '2021-10-21', 62, 358, 37.92);
SELECT insert_read_entry(:'username_1', :'book_22_title', '2021-10-22', 71, 429, 45.44);
SELECT insert_read_entry(:'username_1', :'book_22_title', '2021-10-23', 114, 543, 57.52);
SELECT insert_read_entry(:'username_1', :'book_22_title', '2021-10-24', 74, 617, 65.36);
SELECT insert_read_entry(:'username_1', :'book_22_title', '2021-10-25', 66, 683, 72.35);
SELECT insert_read_entry(:'username_1', :'book_22_title', '2021-10-26', 108, 791, 83.79);
SELECT insert_read_entry(:'username_1', :'book_22_title', '2021-10-27', 88, 879, 93.11);
SELECT insert_read_entry(:'username_1', :'book_22_title', '2021-10-28', 65, 944, 100);

-- INSERT book_23
SELECT insert_read_entry(:'username_1', :'book_23_title', '2021-10-29', 137, 137, 34.25);
SELECT insert_read_entry(:'username_1', :'book_23_title', '2021-10-30', 130, 267, 66.75);
SELECT insert_read_entry(:'username_1', :'book_23_title', '2021-10-31', 133, 400, 100);

-- INSERT book_24
SELECT insert_read_entry(:'username_1', :'book_24_title', '2021-11-01', 55, 55, 17.08);
SELECT insert_read_entry(:'username_1', :'book_24_title', '2021-11-02', 50, 105, 32.61);
SELECT insert_read_entry(:'username_1', :'book_24_title', '2021-11-03', 48, 153, 47.52);
SELECT insert_read_entry(:'username_1', :'book_24_title', '2021-11-04', 56, 209, 64.91);
SELECT insert_read_entry(:'username_1', :'book_24_title', '2021-11-05', 36, 245, 76.09);
SELECT insert_read_entry(:'username_1', :'book_24_title', '2021-11-06', 77, 322, 100);

-- INSERT book_25
SELECT insert_read_entry(:'username_1', :'book_25_title', '2021-11-07', 51, 51, 15.84);
SELECT insert_read_entry(:'username_1', :'book_25_title', '2021-11-08', 52, 103, 31.99);
SELECT insert_read_entry(:'username_1', :'book_25_title', '2021-11-09', 50, 153, 47.52);
SELECT insert_read_entry(:'username_1', :'book_25_title', '2021-11-10', 54, 207, 64.29);
SELECT insert_read_entry(:'username_1', :'book_25_title', '2021-11-11', 115, 322, 100);

-- INSERT book_26
SELECT insert_read_entry(:'username_1', :'book_26_title', '2021-11-12', 49, 49, 14.20);
SELECT insert_read_entry(:'username_1', :'book_26_title', '2021-11-13', 58, 107, 31.01);
SELECT insert_read_entry(:'username_1', :'book_26_title', '2021-11-14', 50, 157, 45.51);
SELECT insert_read_entry(:'username_1', :'book_26_title', '2021-11-15', 44, 201, 58.26);
SELECT insert_read_entry(:'username_1', :'book_26_title', '2021-11-16', 48, 249, 72.17);
SELECT insert_read_entry(:'username_1', :'book_26_title', '2021-11-17', 96, 345, 100);

-- INSERT book_27
SELECT insert_read_entry(:'username_1', :'book_27_title', '2021-11-18', 51, 51, 11.81);
SELECT insert_read_entry(:'username_1', :'book_27_title', '2021-11-19', 52, 103, 23.84);
SELECT insert_read_entry(:'username_1', :'book_27_title', '2021-11-23', 150, 253, 58.56);
SELECT insert_read_entry(:'username_1', :'book_27_title', '2021-11-24', 100, 353, 81.71);
SELECT insert_read_entry(:'username_1', :'book_27_title', '2021-11-25', 79, 432, 100);

-- INSERT book_28
SELECT insert_read_entry(:'username_1', :'book_28_title', '2021-12-01', 57, 57, 14.84);
SELECT insert_read_entry(:'username_1', :'book_28_title', '2021-12-02', 54, 111, 28.91);
SELECT insert_read_entry(:'username_1', :'book_28_title', '2021-12-03', 56, 167, 43.49);
SELECT insert_read_entry(:'username_1', :'book_28_title', '2021-12-04', 54, 221, 57.55);
SELECT insert_read_entry(:'username_1', :'book_28_title', '2021-12-05', 67, 278, 72.4);
SELECT insert_read_entry(:'username_1', :'book_28_title', '2021-12-06', 106, 384, 100);

-- INSERT book_29
SELECT insert_read_entry(:'username_1', :'book_29_title', '2021-12-09', 49, 49, 12.25);
SELECT insert_read_entry(:'username_1', :'book_29_title', '2021-12-10', 48, 97, 24.25);
SELECT insert_read_entry(:'username_1', :'book_29_title', '2021-12-11', 50, 147, 36.75);
SELECT insert_read_entry(:'username_1', :'book_29_title', '2021-12-12', 110, 257, 64.25);
SELECT insert_read_entry(:'username_1', :'book_29_title', '2021-12-13', 62, 319, 79.75);
SELECT insert_read_entry(:'username_1', :'book_29_title', '2021-12-14', 81, 400, 100);

-- INSERT book_30
SELECT insert_read_entry(:'username_1', :'book_30_title', '2021-12-15', 49, 49, 13.32);
SELECT insert_read_entry(:'username_1', :'book_30_title', '2021-12-16', 97, 48, 26.36);
SELECT insert_read_entry(:'username_1', :'book_30_title', '2021-12-17', 56, 153, 41.58);
SELECT insert_read_entry(:'username_1', :'book_30_title', '2021-12-18', 54, 207, 56.25);
SELECT insert_read_entry(:'username_1', :'book_30_title', '2021-12-19', 96, 303, 82.34);
SELECT insert_read_entry(:'username_1', :'book_30_title', '2021-12-20', 96, 368, 100);


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
-- book 19 author
\set book_19_author_1_first_name 'James'
\set book_19_author_1_last_name 'Swallow'
\set book_19_author_1_full_name 'James Swallow'
-- book 20 author
\set book_20_author_1_first_name 'Guy'
\set book_20_author_1_last_name 'Haley'
\set book_20_author_1_full_name 'Guy Haley'
-- book 21 authors
\set book_21_author_1_first_name 'Steve'
\set book_21_author_1_last_name 'Parker'
\set book_21_author_1_full_name 'Steve Parker'
\set book_21_author_2_first_name 'Justin'
\set book_21_author_2_middle_name 'D.'
\set book_21_author_2_last_name 'Hill'
\set book_21_author_2_full_name 'Justin D. Hill'
\set book_21_author_3_first_name 'Ian'
\set book_21_author_3_middle_name 'St.'
\set book_21_author_3_last_name 'Martin'
\set book_21_author_3_full_name 'Ian St. Martin'
\set book_21_author_4_first_name 'Andy'
\set book_21_author_4_last_name 'Chambers'
\set book_21_author_4_full_name 'Andy Chambers'
\set book_21_author_5_first_name 'Chris'
\set book_21_author_5_last_name 'Wraight'
\set book_21_author_5_full_name 'Chris Wraight'
\set book_21_author_6_first_name 'Nick'
\set book_21_author_6_last_name 'Kyme'
\set book_21_author_6_full_name 'Nick Kyme'
\set book_21_author_7_first_name 'Braden'
\set book_21_author_7_last_name 'Campbell'
\set book_21_author_7_full_name 'Braden Campbell'
\set book_21_author_8_first_name 'Ben'
\set book_21_author_8_last_name 'Counter'
\set book_21_author_8_full_name 'Ben Counter'
\set book_21_author_9_first_name 'David'
\set book_21_author_9_last_name 'Annandale'
\set book_21_author_9_full_name 'David Annandale'
\set book_21_author_10_first_name 'Andy'
\set book_21_author_10_last_name 'Clark'
\set book_21_author_10_full_name 'Andy Clark'
\set book_21_author_11_first_name 'Gav'
\set book_21_author_11_last_name 'Thorpe'
\set book_21_author_11_full_name 'Gav Thorpe'
\set book_21_author_12_first_name 'Anthony'
\set book_21_author_12_last_name 'Reynolds'
\set book_21_author_12_full_name 'Anthony Reynolds'
-- book 22 authors
\set book_22_author_1_first_name 'Aaron'
\set book_22_author_1_last_name 'Dembski-Bowden'
\set book_22_author_1_full_name 'Aaron Dembski-Bowden'
\set book_22_author_2_first_name 'David'
\set book_22_author_2_last_name 'Annandale'
\set book_22_author_2_full_name 'David Annandale'
\set book_22_author_3_first_name 'Robbie'
\set book_22_author_3_last_name 'MacNiven'
\set book_22_author_3_full_name 'Robbie MacNiven'
\set book_22_author_4_first_name 'Ben'
\set book_22_author_4_last_name 'Counter'
\set book_22_author_4_full_name 'Ben Counter'
\set book_22_author_5_first_name 'Steve'
\set book_22_author_5_last_name 'Lyons'
\set book_22_author_5_full_name 'Steve Lyons'
\set book_22_author_6_first_name 'Rob'
\set book_22_author_6_last_name 'Sanders'
\set book_22_author_6_full_name 'Rob Sanders'
\set book_22_author_7_first_name 'C'
\set book_22_author_7_middle_name 'L'
\set book_22_author_7_last_name 'Werner'
\set book_22_author_7_full_name 'C L Werner'
\set book_22_author_8_first_name 'Nick'
\set book_22_author_8_last_name 'Kyme'
\set book_22_author_8_full_name 'Nick Kyme'
\set book_22_author_9_first_name 'Andy'
\set book_22_author_9_last_name 'Smillie'
\set book_22_author_9_full_name 'Andy Smillie'
\set book_22_author_10_first_name 'Cavan'
\set book_22_author_10_last_name 'Scott'
\set book_22_author_10_full_name 'Cavan Scott'
\set book_22_author_11_first_name 'Mark'
\set book_22_author_11_last_name 'Clapham'
\set book_22_author_11_full_name 'Mark Clapham'
\set book_22_author_12_first_name 'Lee'
\set book_22_author_12_last_name 'Lightner'
\set book_22_author_12_full_name 'Lee Lightner'
\set book_22_author_13_first_name 'Alec'
\set book_22_author_13_last_name 'Worley'
\set book_22_author_13_full_name 'Alec Worley'
-- book 23 author
\set book_23_author_1_first_name 'Peter'
\set book_23_author_1_last_name 'Fehervari'
\set book_23_author_1_full_name 'Peter Fehervari'
-- book 24 author
\set book_24_author_1_first_name 'Guy'
\set book_24_author_1_last_name 'Haley'
\set book_24_author_1_full_name 'Guy Haley'
-- book 25 author
\set book_25_author_1_first_name 'Guy'
\set book_25_author_1_last_name 'Haley'
\set book_25_author_1_full_name 'Guy Haley'
-- book 26 author
\set book_26_author_1_first_name 'Guy'
\set book_26_author_1_last_name 'Haley'
\set book_26_author_1_full_name 'Guy Haley'
-- book 27 author
\set book_27_author_1_first_name 'Nick'
\set book_27_author_1_last_name 'Kyme'
\set book_27_author_1_full_name 'Nick Kyme'
-- book 28 author
\set book_28_author_1_first_name 'Gav'
\set book_28_author_1_last_name 'Thrope'
\set book_28_author_1_full_name 'Gav Thorpe'
-- book 29 author
\set book_29_author_1_first_name 'Rachel'
\set book_29_author_1_last_name 'Harrison'
\set book_29_author_1_full_name 'Rachel Harrison'
-- book 30 author
\set book_30_author_1_first_name 'Gav'
\set book_30_author_1_last_name 'Thrope'
\set book_30_author_1_full_name 'Gav Thorpe'
-- book 31 author
\set book_31_author_1_first_name 'Gav'
\set book_31_author_1_last_name 'Thrope'
\set book_31_author_1_full_name 'Gav Thorpe'


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
-- book 19 author
SELECT insert_author(:'book_19_author_1_full_name', :'book_19_author_1_first_name', :'book_19_author_1_last_name');
-- book 20 author
SELECT insert_author(:'book_20_author_1_full_name', :'book_20_author_1_first_name', :'book_20_author_1_last_name');
-- book 21 author
SELECT insert_author(:'book_21_author_1_full_name', :'book_21_author_1_first_name', :'book_21_author_1_last_name');
SELECT insert_author(:'book_21_author_2_full_name', :'book_21_author_2_first_name', :'book_21_author_2_last_name', :'book_21_author_2_middle_name');
SELECT insert_author(:'book_21_author_3_full_name', :'book_21_author_3_first_name', :'book_21_author_3_last_name', :'book_21_author_3_middle_name');
SELECT insert_author(:'book_21_author_4_full_name', :'book_21_author_4_first_name', :'book_21_author_4_last_name');
SELECT insert_author(:'book_21_author_5_full_name', :'book_21_author_5_first_name', :'book_21_author_5_last_name');
SELECT insert_author(:'book_21_author_6_full_name', :'book_21_author_6_first_name', :'book_21_author_6_last_name');
SELECT insert_author(:'book_21_author_7_full_name', :'book_21_author_7_first_name', :'book_21_author_7_last_name');
SELECT insert_author(:'book_21_author_8_full_name', :'book_21_author_8_first_name', :'book_21_author_8_last_name');
SELECT insert_author(:'book_21_author_9_full_name', :'book_21_author_9_first_name', :'book_21_author_9_last_name');
SELECT insert_author(:'book_21_author_10_full_name', :'book_21_author_10_first_name', :'book_21_author_10_last_name');
SELECT insert_author(:'book_21_author_11_full_name', :'book_21_author_11_first_name', :'book_21_author_11_last_name');
SELECT insert_author(:'book_21_author_12_full_name', :'book_21_author_12_first_name', :'book_21_author_12_last_name');
-- book 22 author
SELECT insert_author(:'book_22_author_1_full_name', :'book_22_author_1_first_name', :'book_22_author_1_last_name');
SELECT insert_author(:'book_22_author_2_full_name', :'book_22_author_2_first_name', :'book_22_author_2_last_name');
SELECT insert_author(:'book_22_author_3_full_name', :'book_22_author_3_first_name', :'book_22_author_3_last_name');
SELECT insert_author(:'book_22_author_4_full_name', :'book_22_author_4_first_name', :'book_22_author_4_last_name');
SELECT insert_author(:'book_22_author_5_full_name', :'book_22_author_5_first_name', :'book_22_author_5_last_name');
SELECT insert_author(:'book_22_author_6_full_name', :'book_22_author_6_first_name', :'book_22_author_6_last_name');
SELECT insert_author(:'book_22_author_7_full_name', :'book_22_author_7_first_name', :'book_22_author_7_last_name', :'book_22_author_7_middle_name');
SELECT insert_author(:'book_22_author_8_full_name', :'book_22_author_8_first_name', :'book_22_author_8_last_name');
SELECT insert_author(:'book_22_author_9_full_name', :'book_22_author_9_first_name', :'book_22_author_9_last_name');
SELECT insert_author(:'book_22_author_10_full_name', :'book_22_author_10_first_name', :'book_22_author_10_last_name');
SELECT insert_author(:'book_22_author_11_full_name', :'book_22_author_11_first_name', :'book_22_author_11_last_name');
SELECT insert_author(:'book_22_author_12_full_name', :'book_22_author_12_first_name', :'book_22_author_12_last_name');
SELECT insert_author(:'book_22_author_13_full_name', :'book_22_author_13_first_name', :'book_22_author_13_last_name');
-- book 23 author
SELECT insert_author(:'book_23_author_1_full_name', :'book_23_author_1_first_name', :'book_23_author_1_last_name');
-- book 24 author
SELECT insert_author(:'book_24_author_1_full_name', :'book_24_author_1_first_name', :'book_24_author_1_last_name');
-- book 25 author
SELECT insert_author(:'book_25_author_1_full_name', :'book_25_author_1_first_name', :'book_25_author_1_last_name');
-- book 26 author
SELECT insert_author(:'book_26_author_1_full_name', :'book_26_author_1_first_name', :'book_26_author_1_last_name');
-- book 27 author
SELECT insert_author(:'book_27_author_1_full_name', :'book_27_author_1_first_name', :'book_27_author_1_last_name');
-- book 28 author
SELECT inert_author(:'book_28_author_1_full_name', :'book_28_author_1_first_name', :'book_28_author_1_last_name');
-- book 29 author
SELECT insert_author(:'book_29_author_1_full_name', :'book_29_author_1_first_name', :'book_29_author_1_last_name');
-- book 30 author
SELECT insert_author(:'book_30_author_1_full_name', :'book_30_author_1_first_name', :'book_30_author_1_last_name');
-- book 31 author
SELECT insert_author(:'book_31_author_1_full_name', :'book_31_author_1_first_name', :'book_31_author_1_last_name');


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
-- book 19 author
SELECT join_book_author(:'book_19_title', :'book_19_author_1_full_name');
-- book 20 author
SELECT join_book_author(:'book_20_title', :'book_20_author_1_full_name');
-- book 21 author
SELECT join_book_author(:'book_21_title', :'book_21_author_1_full_name');
SELECT join_book_author(:'book_21_title', :'book_21_author_2_full_name');
SELECT join_book_author(:'book_21_title', :'book_21_author_3_full_name');
SELECT join_book_author(:'book_21_title', :'book_21_author_4_full_name');
SELECT join_book_author(:'book_21_title', :'book_21_author_5_full_name');
SELECT join_book_author(:'book_21_title', :'book_21_author_6_full_name');
SELECT join_book_author(:'book_21_title', :'book_21_author_7_full_name');
SELECT join_book_author(:'book_21_title', :'book_21_author_8_full_name');
SELECT join_book_author(:'book_21_title', :'book_21_author_9_full_name');
SELECT join_book_author(:'book_21_title', :'book_21_author_10_full_name');
SELECT join_book_author(:'book_21_title', :'book_21_author_11_full_name');
SELECT join_book_author(:'book_21_title', :'book_21_author_12_full_name');
-- book 22 author
SELECT join_book_author(:'book_22_title', :'book_22_author_1_full_name');
SELECT join_book_author(:'book_22_title', :'book_22_author_2_full_name');
SELECT join_book_author(:'book_22_title', :'book_22_author_3_full_name');
SELECT join_book_author(:'book_22_title', :'book_22_author_4_full_name');
SELECT join_book_author(:'book_22_title', :'book_22_author_5_full_name');
SELECT join_book_author(:'book_22_title', :'book_22_author_6_full_name');
SELECT join_book_author(:'book_22_title', :'book_22_author_7_full_name');
SELECT join_book_author(:'book_22_title', :'book_22_author_8_full_name');
SELECT join_book_author(:'book_22_title', :'book_22_author_9_full_name');
SELECT join_book_author(:'book_22_title', :'book_22_author_10_full_name');
SELECT join_book_author(:'book_22_title', :'book_22_author_11_full_name');
SELECT join_book_author(:'book_22_title', :'book_22_author_12_full_name');
SELECT join_book_author(:'book_22_title', :'book_22_author_13_full_name');
-- book 23 author
SELECT join_book_author(:'book_23_title', :'book_23_author_1_full_name');
-- book 24 author
SELECT join_book_author(:'book_24_title', :'book_24_author_1_full_name');
-- book 25 author
SELECT join_book_author(:'book_25_title', :'book_25_author_1_full_name');
-- book 26 author
SELECT join_book_author(:'book_26_title', :'book_26_author_1_full_name');
-- book 27 author
SELECT join_book_author(:'book_27_title', :'book_27_author_1_full_name');
-- book 28 author
SELECT join_book_author(:'book_28_title', :'book_28_author_1_full_name');
-- book 29 author
SELECT join_book_author(:'book_29_title', :'book_29_author_1_full_name');
-- book 30 author
SELECT join_book_author(:'book_30_title', :'book_30_author_1_full_name');
-- book 31 author
SELECT join_book_author(:'book_31_title', :'book_31_author_1_full_name');


/* --------------------------------------------- UPDATE read_instance --------------------------------------------- */
-- FUNCTION UPDATE read_instance
CREATE OR REPLACE FUNCTION update_read_instance(
  arg_username VARCHAR,
  arg_book_title VARCHAR,
  arg_is_reading BOOLEAN,
  arg_is_finished BOOLEAN,
  arg_is_dnf BOOLEAN
)
RETURNS VOID AS $$
DECLARE
  var_reader_id INT = get_reader_id($1);
  var_book_id INT = get_book_id($2);
  var_read_instance_id INT = get_read_instance_id($1, $2);
BEGIN
    UPDATE    read_instance
    SET       days_read =       t2.days_read,
              days_total =      t2.days_total,
              pages_read =      t2.pages_read,
              max_daily_read =  (SELECT   COALESCE(MAX(daily_read.daily_pages_read), 0)
                                FROM      (SELECT   SUM(pages_read) AS daily_pages_read
                                          FROM      read_entry AS re
                                          WHERE     re.read_instance_id = var_read_instance_id
                                          GROUP     BY Date(re.date_read)) AS daily_read),
              is_reading =      arg_is_reading,
              is_finished =     arg_is_finished,
              is_dnf =          arg_is_dnf
    FROM      (SELECT     COUNT(DISTINCT Date(re.date_read)) AS days_read,
                          COALESCE(MAX(Date(re.date_read)) - MIN(Date(re.date_read)) + 1, 0) AS days_total,
                          COALESCE(SUM(re.pages_read), 0) AS pages_read
              FROM        read_entry AS re
              WHERE       re.read_instance_id = var_read_instance_id) AS t2
    WHERE     read_instance.id = var_read_instance_id;
END;
$$ LANGUAGE plpgsql;


-- UPDATE read_instance.is_finished to true
SELECT update_read_instance(:'username_1', :'book_1_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_2_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_3_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_4_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_5_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_6_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_7_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_8_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_9_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_10_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_11_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_12_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_13_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_14_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_15_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_16_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_17_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_18_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_19_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_20_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_21_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_22_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_23_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_24_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_25_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_26_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_27_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_28_title', FALSE, TRUE, FALSE);
SELECT update_read_instance(:'username_1', :'book_29_title', FALSE, TRUE, FALSE);
-- UPDATE read_instance.is_reading to true
SELECT update_read_instance(:'username_1', :'book_30_title', TRUE, FALSE, FALSE);
SELECT update_read_instance(:'username_1', :'book_31_title', TRUE, FALSE, FALSE);


/* --------------------------------------------- UPDATE reader_book  --------------------------------------------- */
-- FUNCTION UPDATE reader_book
CREATE OR REPLACE FUNCTION update_reader_book(arg_username VARCHAR, arg_book_title VARCHAR)
RETURNS VOID AS $$
DECLARE
  var_reader_id INT = get_reader_id($1);
  var_book_id INT = get_book_id($2);
  var_reader_book_id INT = get_reader_book_id($1, $2);
BEGIN
    UPDATE  reader_book
    SET     is_any_reading =     t2.is_any_reading,
            is_any_finished =    t2.is_any_finished,
            is_all_dnf =         t2.is_any_dnf
    FROM (SELECT  bool_or(ri.is_reading) AS is_any_reading,
                  bool_or(ri.is_finished) AS is_any_finished,
                  bool_and(ri.is_dnf) AS is_any_dnf
                  FROM read_instance AS ri
                  INNER JOIN reader_book AS rb
                  ON ri.reader_book_id = rb.id
                  AND rb.id = var_reader_book_id) AS t2
    WHERE reader_book.id = var_reader_book_id;
END;
$$ LANGUAGE plpgsql;


SELECT update_reader_book(:'username_1', :'book_1_title');
SELECT update_reader_book(:'username_1', :'book_2_title');
SELECT update_reader_book(:'username_1', :'book_3_title');
SELECT update_reader_book(:'username_1', :'book_4_title');
SELECT update_reader_book(:'username_1', :'book_5_title');
SELECT update_reader_book(:'username_1', :'book_6_title');
SELECT update_reader_book(:'username_1', :'book_7_title');
SELECT update_reader_book(:'username_1', :'book_8_title');
SELECT update_reader_book(:'username_1', :'book_9_title');
SELECT update_reader_book(:'username_1', :'book_10_title');
SELECT update_reader_book(:'username_1', :'book_11_title');
SELECT update_reader_book(:'username_1', :'book_12_title');
SELECT update_reader_book(:'username_1', :'book_13_title');
SELECT update_reader_book(:'username_1', :'book_14_title');
SELECT update_reader_book(:'username_1', :'book_15_title');
SELECT update_reader_book(:'username_1', :'book_16_title');
SELECT update_reader_book(:'username_1', :'book_17_title');
SELECT update_reader_book(:'username_1', :'book_18_title');
SELECT update_reader_book(:'username_1', :'book_19_title');
SELECT update_reader_book(:'username_1', :'book_20_title');
SELECT update_reader_book(:'username_1', :'book_21_title');
SELECT update_reader_book(:'username_1', :'book_22_title');
SELECT update_reader_book(:'username_1', :'book_23_title');
SELECT update_reader_book(:'username_1', :'book_24_title');
SELECT update_reader_book(:'username_1', :'book_25_title');
SELECT update_reader_book(:'username_1', :'book_26_title');
SELECT update_reader_book(:'username_1', :'book_27_title');
SELECT update_reader_book(:'username_1', :'book_28_title');
SELECT update_reader_book(:'username_1', :'book_29_title');
SELECT update_reader_book(:'username_1', :'book_30_title');
SELECT update_reader_book(:'username_1', :'book_31_title');


/* --------------------------------------------- DROP functions --------------------------------------------- */
DROP FUNCTION get_reader_id, get_book_id, get_author_id, get_reader_book_id, get_read_instance_id, insert_reader, insert_book, insert_reader_book, insert_read_instance, insert_read_entry, insert_author, join_book_author, update_read_instance, update_reader_book;