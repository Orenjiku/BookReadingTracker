# Constraints
| Num | Constraint | Template | Example |
| --- | ---------- | -------- | ------- |
| 1 | primary key | pk_{table_name} | pk_reader |
| 2 | foreign key | fk_{foreign_key_table_name}_{primary_key_table_name} | fk_reader_book |
| 3 | unique | uq_{table_name}_{col_name} | uq_reader_username |
| 4 | check | ck_{table_name}_{col_name} | ck_book_total_pages |
| 5 | index | ix_{table_name}_{col_name} | ix_reader_username


`GET /books` Retrieves a list of books that are currently being read.

Parameters

| Parameter | Type | In | Description |
| --------- | ---- | --- | ----------- |
| roomNumber | string | query | [Optional] Room number |
| floorNumber | number | query | [Optional] Floor number |
| roomType | string | query | [Optional] Room type |
| isClean | boolean | query | [Optional] Current cleanliness status of room |
| isOccupied | boolean | query | [Optional] Current occupancy status of room |

*NOTE: Each additional parameter is treated as an AND operation narrowing the search*

**important : reservation_id will return "" or null if there is no reservation**

Response

`Status: 200 OK`

```JSON
[
  {
    "id": 1,
    "title": "The Uriel Ventris Chronicles: Volume Two",
    "title_sort": "Uriel Ventris Chronicles: Volume Two, The",
    "author": [
      "Graham McNeill"
    ],
    "total_pages": 848,
    "book_description": "The second omnibus of stories featuring one of Warhammer 40,000's most prominent characters, Ultramarine Captain Uriel     Ventris.\\n\\nThe Ultramarines are the epitome of a Space Marine Chapter. Warriors without peer, their name is a byword for discipline and honour, and their heroic deeds are legendary.\\n\\nCaptain Uriel Ventris fights to prove his worth and return to the hallowed ranks of the Chapter after his exile to the Eye of Terror. But as the Iron Warriors move against Ultramar, a grim premonition comes to light: Ventris will have a part to play in the coming war... for good or ill. The ongoing story of the Uriel Ventris continues in this omnibus edition, featuring the novels The Killing Ground, Courage and Honour and The Chapter''s Due, as well as several short stories and the classic comic 'Black Bone Road'.",
    "picture_link": "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1561287919l/44180905.jpg",
    "book_read": [
      {
        "id": 1,
        "days_read": 10,
        "days_total": 10,
        "is_complete": false,
        "is_reading": true,
        "read_entry": [
          {
            "id": 1,
            "date_read": "2021-07-12",
            "page_completed": "0",
            "percentage_completed": "0"
          },
          {
            "id": 2,
            "date_read": "2021-07-13",
            "page_completed": 53,
            "percentage_completed": 6.63
          },
          {
            "id": 3,
            "date_read": "2021-07-14",
            "page_completed": 101,
            "percentage_completed": 6.63
          },
          ...
        ]
      },
      {
        ...
      }
    ]
  },
  {
    "id": 2,
    "title": "the uriel ventris chronicles: volume one",
    "title_sort": "uriel ventris chronicles: volume one, the",
    "author": [
      "graham mcneill"
    ],
    "total_pages": 800,
    ...
  }
]
```