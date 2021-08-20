# Database Markdown

## Table of Contents
1. [Constraints Naming Convention](#constraints-naming-convention)
2. [PostgreSQL Database Dump Guide](#postgresql-database-dump-guide)
3. [Database API Response](#database-api-response)
---
<br>

## **Constraints Naming Convention**
| Num | Constraint | Template | Example |
| --- | ---------- | -------- | ------- |
| 1 | primary key | pk_{table_name} | pk_reader |
| 2 | foreign key | fk_{foreign_key_table_name}_{primary_key_table_name} | fk_reader_reader_book |
| 3 | unique | uq_{table_name}_{col_name} | uq_reader_username |
| 4 | check | ck_{table_name}_{col_name} | ck_book_total_pages |
| 5 | index | ix_{table_name}_{col_name} | ix_reader_username |
---
<br>

## **PostgreSQL Database Dump Guide**
#### **_Note:_** Replace { type } with specified values.
<br>

### Go to dump.sql file:
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
    ~~~~sql
    \set username_1 {'username'}
    \set first_name_1 {'first_name'}
    \set last_name_1 {'last_name'}
    \set email_1 {'email'}
    ~~~~

2.  Insert reader using variables defined in previous step.
    ~~~~sql
    SELECT insert_reader(:'username_1', :'first_name_1', :'last_name_1', :'email_1');
    ~~~~

3.  Set book variables used for insert_book function in next step.  
    **_Note:_** Use same { number } for all related variables related to the book.  
      _Example_: book_1_title, book_1_title_sort, book_1_total_pages
    | title | title_sort | total_pages | blurb | picture_link |
    | ----- | ---------- | ----------- | ----- | ------------ |
    | string | string | string | string | string | string |
     ~~~~sql
     \set book_{number}_title {'title'}
     \set book_{number}_title_sort {'title_sort'}
     \set book_{number}_total_pages {'total_pages'}
     \set book_{number}_blurb {'blurb'}
     \set book_{number}_picture_link {'picture_link'}
     ~~~~

4.  INSERT book using variables defined in previous step.  
    **_Reminder:_** Change { number } in variable to corresponding book
    ~~~~sql
    SELECT insert_book(:'book_{number}_title', :'book_{number}_title_sort', :'book_{number}_total_pages', :'book_{number}_blurb', :'book_{number}_picture_link');
    ~~~~

5.  INSERT reader_book (Join Table)  
    Create relationship between user and book.  
    **_Reminder:_** Change { number } in variable to corresponding book
    ~~~~sql
    SELECT join_reader_book(:'username_1', :'book_{number}_title');
    ~~~~

6.  INSERT book_read  
    Creates book_read entry that is associated to reader_book.id from previous step.  
    **_Reminder:_** Change { number } to a number.
    ~~~~sql
    SELECT insert_book_read(:'username_1', :'book_{number}_title');
    ~~~~

7.  INSERT read_entry  
    Creates read_entry entry that is associated to book_read.id from previous step.  
    **_Reminder:_** Change { number } to a number.
    | date_read | pages_read | current_page | current_percent |
    | --- | ---------- | -------- | ------- |
    | string | number | number | number |
    ~~~~sql
    SELECT insert_read_entry({date_read}, {pages_read}, {current_page}, {current_percent}, :'book_{number}_title');
    ~~~~

8.  Set book author(s) used for insert_author function in next step.  
    | first_name | middle_name | last_name | full_name |
    | ---------- | ----------- | --------- | --------- |
    | string | string | string | string

    **_Note:_** middle_name is optional.
    **_Reminder_** Change { number } to a number.
    ~~~~sql
    \set book_{number}_author_{number}_first_name {'first_name'}
    \set book_{number}_author_{number}_middle_name {'middle_name'}
    \set book_{number}_author_{number}_last_name {'last_name'}
    \set book_{number}_author_{number}_full_name {'full_name'}
    ~~~~

9.  INSERT author(s) using variables defined in previous step.  
    **_Reminder:_** Change { number } to a number.
    ~~~~sql
    SELECT insert_author(:'book_{number}_author_{number}_full_name', :'book_{number}_author_{number}_first_name', :'book_{number}_author_{number}_last_name');
    ~~~~

10. INSERT book_author (Join Table)  
    Create relationship between book and author(s)  
    **_Reminder:_** Change { number } to a number.
    ~~~~sql
    SELECT join_book_author(:'book_{number}_title', :'book_{number}_author_{number}_full_name');
    ~~~~

11. UPDATE book_read (Optional)  
    Update whether a book is currently being read.  
    **_Note:_** is_reading and is_finished default value is FALSE  
    **_Reminder:_** Change { number } to a number.
    | username | book_title | days_read | days_total | is_reading | is_finished
    | --- | ---------- | -------- | ------- | ------ | ------- |
    | string | string | number | number | boolean | boolean |
    ~~~~sql
    SELECT update_book_read(:'username_1', :'book_{number}_title', {days_read}, {days_total}, {is_reading}, {is_finished});
    ~~~~
---
<br>

## **Database API Response**
<br>

`GET /:id/currently_reading` <br />
Retrieves a list of books that are currently being read.

### Parameters

| Parameter | Type | In | Description |
| --------- | ---- | --- | ----------- |
| :id | number | query | reader id |

### Response

`Status: 200 OK`

```JSON
[
  {
    "b_id": 11,
    "title": "The Uriel Ventris Chronicles: Volume Two",
    "author": [
      "Graham McNeill"
    ],
    "total_pages": 848,
    "blurb": "The second omnibus of stories featuring one of Warhammer 40,000's most prominent characters, Ultramarine Captain Uriel Ventris.\n\nThe Ultramarines are the epitome of a Space Marine Chapter. Warriors without peer, their name is a byword for discipline and honour, and their heroic deeds are legendary.\n\nCaptain Uriel Ventris fights to prove his worth and return to the hallowed ranks of the Chapter after his exile to the Eye of Terror. But as the Iron Warriors move against Ultramar, a grim premonition comes to light: Ventris will have a part to play in the coming war... for good or ill. The ongoing story of the Uriel Ventris continues in this omnibus edition, featuring the novels The Killing Ground, Courage and Honour and The Chapter's Due, as well as several short stories and the classic comic 'Black Bone Road'.",
    "picture_link": "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1561287919l/44180905.jpg",
    "book_read": [
      {
        "br_id": 11,
        "days_read": 11,
        "days_total": 20,
        "read_entry": [
          {
            "re_id": 76,
            "date_read": "2021-08-08T00:00:00-04:00",
            "pages_read": 131,
            "current_page": 848,
            "current_percent": 100
          },
          {
            "re_id": 75,
            "date_read": "2021-08-07T00:00:00-04:00",
            "pages_read": 118,
            "current_page": 717,
            "current_percent": 84.55
          },
          {
            "re_id": 74,
            "date_read": "2021-08-06T00:00:00-04:00",
            "pages_read": 104,
            "current_page": 599,
            "current_percent": 70.64
          },
          {
            "re_id": 73,
            "date_read": "2021-07-27T23:30:00:-04:00",
            "current_page": 495,
            "current_percent": 58.37
          },
          ...
        ]
      },
      {
        "br_id": 10,
        "days_read": 16,
        "days_total": 16,
        "read_entry": [
          {
            "re_id": 27,
            ...
          },
          ...
        ]
      }
    ]
  },
  {
    "b_id": 8,
    "title": "Maledictions: A Horror Anthology",
    "author": [
      "Cassandra Khaw",
      "Richard Strachan",
      "Graham McNeill",
      "lora Gray",
      "C L Werner",
      "Peter McLean",
      "David Annandale",
      "Paul Kane",
      "Josh Reynolds",
      "J.C. Stearns",
      "Alec Worley"
    ],
    "total_pages": 352,
    ...
  },
  ...
]
```

`GET /:id/finished_reading` <br />
Retrieves a list of books that reader has finished reading.

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
      "Cassandra Khaw",
      "Richard Strachan",
      "Graham McNeill",
      "Lora Gray",
      "C L Werner",
      "Peter McLean",
      "David Annandale",
      "Paul Kane",
      "Josh Reynolds",
      "J.C. Stearns",
      "Alec Worley"
    ],
    "total_pages": 352,
    ...
  },
  {
    "b_id": 2,
    "title": "Malleus",
    "author": [
      "Dan Abnett"
    ],
    "total_pages": 416,
    "blurb": "Summary provided on the back cover of the book",
    "picture_link": "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1427161165l/23492350.jpg",
    "book_read": [
      {
        "br_id": 2,
        "days_read": 7,
        "days_total": 7,
        "read_entry": [
          {
            "re_id": 13,
            "date_read": "2021-06-07T00:00:00-04:00",
            "current_page": 416,
            "current_percent": 100
          },
          {
            "re_id": 12,
            "date_read": "2021-06-06T00:00:00-04:00",
            "current_page": 357,
            "current_percent": 54.09
          },
          {
            "re_id": 11,
            "date_read": "2021-06-05T00:00:00-04:00",
            "current_page": 177,
            "current_percent": 42.55
          },
          ...
        ]
      },
      {
        "br_id": 1
        ...
      }
    ]
  },
  ...
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