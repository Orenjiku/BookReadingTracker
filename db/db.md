# API

## Table of Contents

## Constraints Naming Convention
| Num | Constraint | Template | Example |
| --- | ---------- | -------- | ------- |
| 1 | primary key | pk_{table_name} | pk_reader |
| 2 | foreign key | fk_{foreign_key_table_name}_{primary_key_table_name} | fk_reader_reader_book |
| 3 | unique | uq_{table_name}_{col_name} | uq_reader_username |
| 4 | check | ck_{table_name}_{col_name} | ck_book_total_pages |
| 5 | index | ix_{table_name}_{col_name} | ix_reader_username |


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
    "b_id": 12,
    "title": "Iron Warriors: The Omnibus",
    "author": [
      "Graham McNeill"
    ],
    "total_pages": 688,
    ...
  },
  {
    "b_id": 11,
    "title": "The Uriel Ventris Chronicles: Volume Two",
    "author": [
      "Graham McNeill"
    ],
    "total_pages": 848,
    "blurb": "Summary provided on the back cover of the book",
    "picture_link": "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1561287919l/44180905.jpg",
    "book_read": [
      {
        "br_id": 11,
        "days_read": 10,
        "days_total": 10,
        "read_entry": [
          {
            "re_id": 73,
            "date_read": "2021-07-27T23:30:00:-04:00",
            "current_page": 495,
            "current_percent": 58.37
          },
          {
            "re_id": 72,
            "date_read": "2021-07-26T22:00:00:-04:00",
            "current_page": 447,
            "current_percent": 52.71
          },
          {
            "re_id": 71,
            "date_read": "2021-07-25T22:15:40:-04:00",
            "current_page": 401,
            "current_percent": 47.29
          },
          ...
        ]
      },
      {
        "br_id": 10,
        "days_read": 4,
        "days_total": 6,
        ...
      }
    ]
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