# Database Markdown

## Table of Contents
1. [PostgreSQL DB Table Constraints Naming Convention](#postgresql-db-table-constraints-naming-convention)
2. [PostgreSQL Database Seed Guide](#postgresql-database-seed-guide)
3. [Database API Request & Response](#database-api-request-response)
---

## **PostgreSQL DB Table Constraints Naming Convention**
| Num | Constraint | Template | Example |
| --- | ---------- | -------- | ------- |
| 1 | primary key | pk_{table_name} | pk_reader |
| 2 | foreign key | fk_{foreign_key_table_name}_{primary_key_table_name} | fk_reader_reader_book |
| 3 | unique | uq_{table_name}_{col_name} | uq_reader_username |
| 4 | check | ck_{table_name}_{col_name} | ck_book_total_pages |
| 5 | index | ix_{table_name}_{col_name} | ix_reader_username |
---

## **PostgreSQL Database Seed Guide**
#### **_Note:_** Replace { type } with specified values.

### Go to seed.sql file:
1. Enter name for database.
    ~~~~sql
    \set my_db {string}
    ~~~~

### Go to insert.sql file:
1.  Set user variables used for insert_reader function in next step.
    | username | first_name | last_name | email |
    | -------- | ---------- | --------- | ----- |
    | string | string | string| string |

    **_Reminder:_** Wrap string in quotes  
    **_Note:_** username_1 will be used to create the rest of the tables
    ~~~~sql
    \set username_1 {username}
    \set first_name_1 {first_name}
    \set last_name_1 {last_name}
    \set email_1 {email}
    ~~~~

2.  Insert reader using variables defined in previous step.
    ~~~~sql
    SELECT insert_reader(:'username_1', :'first_name_1', :'last_name_1', :'email_1');
    ~~~~

3.  Set book variables used for insert_book function in next step.  
    **_Note:_** Use same { number } for all related variables related to the book.  
      _Example_: \set book_1_title 'Name book here'
    | title | title_sort | published_date | published_date_edition | book_format | total_pages | blurb | book_cover_url |
    | ----- | ---------- | -------------- | ---------------------- | ----------- | ----------- | ----- | ------------ |
    | string | string | string | string | string | string | string | string | string |
     ~~~~sql
     \set book_{number}_title {title}
     \set book_{number}_title_sort {title_sort}
     \set book_{number}_published_date {published_date}
     \set book_{number}_published_date_edition {published_date_edition}
     \set book_{number}_book_format {book_format}
     \set book_{number}_total_pages {total_pages}
     \set book_{number}_blurb {blurb}
     \set book_{number}_book_cover_url {book_cover_url}
     ~~~~

4.  INSERT book using variables defined in previous step.  
    **_Reminder:_** Change { number } in variable to corresponding book
    ~~~~sql
    SELECT insert_book(:'book_{number}_title', :'book_{number}_title_sort', :'book_{number}_published_date', :'book_{number}_published_date_edition', :'book_{number}_book_format', :'book_{number}_total_pages', :'book_{number}_blurb', :'book_{number}_book_cover_url');
    ~~~~

5.  INSERT reader_book  
    Create relationship between reader and book.
    **_Reminder:_** Change { number } in variable to corresponding book
    ~~~~sql
    SELECT insert_reader_book(:'username_1', :'book_{number}_title');
    ~~~~

6.  INSERT read_instance  
    Create relationship between read_instance and reader_book
    **_Reminder:_** Change { number } in variable to corresponding book
    ~~~~sql
    SELECT insert_read_instance(:'username_1', :'book_{number}_title');
    ~~~~
7.  INSERT read_entry  
    Creates read_entry entry that is associated to book_read.id from previous step.  
    **_Reminder:_** Change { number } to a number.
    | date_read | current_page |
    | --------- | ------------ |
    | string | number |
    ~~~~sql
    SELECT insert_read_entry(:'username_1' :'book_{number}_title', {date_read}, {current_page}, :'book_{number}_total_pages');
    ~~~~

8.  INSERT author  
    **_Reminder:_** Change { number } to a number.
    | author |
    | ------ |
    | string |
    ~~~~sql
    SELECT insert_author(:'book_{number}_title', {author});
    ~~~~

9. UPDATE read_instance  
    Update read_instance meta data based on its read_entry data.  
    **_Reminder:_** Change { number } to a number.
    | is_reading | is_finished | is_dnf |
    | ---------- | ----------- | ------ |
    | boolean | boolean | boolean |
    ~~~~sql
    SELECT update_read_instance(:'username_1', :'book_{number}_title', {is_reading}, {is_finished}, {is_dnf});
    ~~~~

10. UPDATE reader_book  
    Update reader_book meta data based on its read_instance data.  
    **_Reminder:_** Change { number } to a number.
    ~~~~sql
    SELECT update_reader_book(:'username_1', :'book_{number}_title');
    ~~~~
---

## **Database API Request Response**

`GET /:id/currently_reading` <br />
Retrieves a list of books that are currently being read.
**_Note:_** Every reread of a book is a new row in reader_book table. See example below: rb_id: 15 and rb_id: 12.

### Parameters

| Parameter | Type | In | Description |
| --------- | ---- | --- | ----------- |
| :id | number | query | reader id |

### Response

`Status: 200 OK`

```JSON
[
  {
    "b_id": 15,
    "title": "Deathwatch",
    "author": [
      "Steve Parker"
    ],
    "published_date": "2013-04-11",
    "published_date_edition": "2019-10-15",
    "book_format": "Paperback"
    "total_pages": 512,
    "blurb":  "Action packed novel featuring the galaxies foremost alien hunting taskforce, the Deathwatch. Led by Librarian Karras, the elite alien-hunting Talon Squad must penetrate a genestealer lair and put the abominations to the flame or face the consequences of an entire planet's extinction.//n//nGathered from the many Chapters of Space Marines, the Deathwatch are elite, charged with defending the Imperium of Man from aliens. Six Space Marines, strangers from different words, make up Talon Squad. On 31-Caro, a new terror has emerged, a murderous shadow that stalks the dark, and only the Deathwatch can stop it. Under the direction of a mysterious Inquisitor Lord known only as Sigma, they must cleanse this planet or die in the attempt.",
    "book_cover_url": "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1561288604l/52357292._SX318_SY475_.jpg",
    "reader_book": {
      "rb_id": 15,
      "is_any_reading": true,
      "is_any_finished": true,
      "is_all_dnf": false,
      "read_instance": [
        {
          "ri_id": 21,
          "days_read": 3,
          "days_total": 7,
          "pages_read": 283,
          "max_daily_read": 131,
          "is_reading": true,
          "is_finished": false,
          "is_dnf": false,
          "reader_book_id": 15,
          "read_entry": [
            {
              "re_id": 121,
              "date_read": "2021-09-20T00:00:00-04:00",
              "pages_read": 131,
              "current_page": 283,
              "current_percent": 55.27
            },
            {
              "re_id": 120,
              "date_read": "2021-09-15T00:00:00-04:00",
              "pages_read": 110,
              "current_page": 152,
              "current_percent": 29.69
            },
            {
              "re_id": 119,
              "date_read": "2021-09-15T00:00:00-04:00",
              "pages_read": 42,
              "current_page": 42,
              "current_percent": 8.20
            }
          ]
        },
        {
          "ri_id": 15,
          "days_read": 7,
          "days_total": 7,
          "pages_read": 512,
          "max_daily_read": 183,
          "is_reading": false,
          "is_finished": true,
          "is_dnf": false,
          "reader_book_id": 15,
          "read_entry": [
            {
              "re_id": 90,
              "date_read": "2021-08-20T00:00:00-04:00",
              "pages_read": 183,
              "current_page": 512,
              "current_percent": 100
            },
            ...
          ]
        }
      ]
    }
  },
  {
    "b_id": 14,
    "title": "Warden of the Blade",
    "author": [
      "David Annandale"
    ],
    "published_date": "2016-11-12",
    "published_date_edition": "2018-01-23",
    "book_format": "Paperback",
    "total_pages": 320,
    ...
  },
  ...
]
```

`GET /:id/finished_reading` <br />
Retrieves a list of books that reader has finished reading.  
**_Note:_** Same response shape as GET currently_reading above.

### Parameters

| Parameter | Type | In | Description |
| --------- | ---- | --- | ----------- |
| :id | number | query | reader id |

### Response

`Status: 200 OK`

```JSON
[
  {
    "b_id": 8,
    "title": "Maledictions: A Horror Anthology",
    "author": [
        "David Annandale",
        "Lora Gray",
        "Paul Kane",
        "Cassandra Khaw",
        "Peter McLean",
        "Graham McNeill",
        "Josh Reynolds",
        "J.C. Stearns",
        "Richard Strachan",
        "C L Werner",
        "Alec Worley"
    ],
    "published_date": "2019-03-30",
    "published_date_edition": "2019-04-02",
    "book_format": "Paperback",
    "total_pages": 352,
    "blurb": "A eclectic collection of gut wrenching tales to spook and scare.\n\nHorror is no stranger to the worlds of Warhammer. Its very fabric is infested with the arcane, the strange and the downright terrifying. From the cold, vastness of the 41st millenium to the creeping evil at large in the Mortal Realms, this anthology of short stories explores the sinister side of Warhammer in a way it never has been before. Psychological torment, visceral horrors, harrowing tales of the supernatural and the nightmares buried within, this collection brings together some of the best horror writing from the Black Library.\n\nFeaturing stories from Graham McNeill, Cassandra Khaw, Alec Worley, David Annandale and more.",
    "book_cover_url": "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1548642309l/40744548.jpg",
    "reader_book": {
      "rb_id": 8,
      "is_any_reading": false,
      "is_any_finished": true,
      "is_all_dnf": false,
      "read_instance": [
        {
          "ri_id": 8,
          "days_read": 4,
          "days_total": 4,
          "pages_read": 352,
          "max_daily_read": 152,
          "is_reading": false,
          "is_finished": true,
          "is_dnf": false,
          "reader_book_id": 8,
          "read_entry": [
            {
              "re_id": 43,
              "date_read": "2021-07-10T00:00:00-04:00",
              "pages_read": 69,
              "current_page": 352,
              "current_percent": 100
            },
            {
              "re_id": 42,
              "date_read": "2021-07-09T00:00:00-04:00",
              "pages_read": 152,
              "current_page": 283,
              "current_percent": 80.4
            },
            ...
          ]
        }
      ]
    }
  },
  {
    "b_id": 2,
    "title": "Malleus",
    "author": [
      "Dan Abnett"
    ],
    "published_date": "2001-12-27",
    "published_date_edition": "2015-08-11",
    "book_format": "Paperback",
    "total_pages": 416,
    ...
  }
]
```

`GET /:id/daily_reads` <br />
Retrieves a list of dates that reader has read a book

### Parameters

| Parameter | Type | In | Description |
| --------- | ---- | --- | ----------- |
| :id | number | query | reader id |

### Response

`Status: 200 OK`

```JSON
[
  {
    "date_read": "2021-07-11T04:00:00.000Z",
    "total_pages_read": 397,
    "book_pages_breakdown": [
      {
        "book_title": "Cadian Honour",
        "pages_read": 397
      }
    ]
  },
  {
    "date_read": "2021-07-10T04:00:00.000Z",
    "total_pages_read": 168,
    "book_pages_breakdown": [
      {
        "book_title": "Cadian Honour",
        "pages_read": 99
      },
      {
        "book_title": "Maledictions: A Horror Anthology",
        "pages_read": 69
      }
    ]
  },
  {
    "date_read": "2021-07-09T04:00:00.000Z",
    "total_pages_read": 152,
    "book_pages_breakdown": [
      {
        "book_title": "Maledictions: A Horror Anthology",
        "pages_read": 152
      }
    ]
  },
  ...
]
```