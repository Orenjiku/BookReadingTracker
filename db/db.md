# Constraints
| Num | Constraint | Template | Example |
| --- | ---------- | -------- | ------- |
| 1 | primary key | pk_{table_name} | pk_reader |
| 2 | foreign key | fk_{foreign_key_table_name}_{primary_key_table_name} | fk_reader_book |
| 3 | unique | uq_{table_name}_{col_name} | uq_reader_username |
| 4 | check | ck_{table_name}_{col_name} | ck_book_total_pages |
| 5 | index | ix_{table_name}_{col_name} | ix_reader_username


`GET /reading` Retrieves a list of books that are currently being read.

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
    "_id": "602b14fd541461fcab3686b5",
    "roomType_id": "602b118a541461fcab3686ac",
    "reservation_id": "602b3b5e94bd6e1e4f85decf",
    "roomType": "Ocean View King Suite",
    "price": "400.00",
    "read_entry": [
      {
        "id": 1,
        "date_read": 
        "page_completed": 
        "percentage_completed":
      },
      {
        "id
      },
      ...
    ],
    "roomNumber": "110",
    "floorNumber": 1,
    "currentGuests": [
      {
        "firstName": "Guest",
        "lastName": "One",
        "phone": "123-456-7890",
        "email": "guestOne@madeup.com"
      },
      {
        "firstName": "Guest",
          ...
      }
    ],
    "isOccupied": true,
    "isUsable": true,
    "isClean": true,
    "tasks": [
      {
        "_id": "602b29a394bd6e1e4f85deac",
        "room_id": "602b14fd541461fcab3686b5",
        "location": "110",
        "taskTitle": "Clean Room",
        "taskDescription": "Daily Cleaning",
        "department": "Housekeeping",
        "createdAt": "2021-02-14T11:00:00.000Z",
        "dueBy": "2021-02-14T20:00:00.000Z",
        "isComplete": true,
        "isCleaning": true,
        "completedAt": "2021-02-14T19:00:00.000Z",
        "employeeCompleted": "Spencer Brook",
        "employeeCreated": "system",
        "employeeAssigned": "Spencer Brook",
        "employeeAssigned_id": "auth0|602c301102061a0069805815",
        "employeeCompleted_id": "auth0|602c301102061a0069805815",
        "employeeCreated_id": ""
      },
      {
        "_id": "602b2d4d94bd6e1e4f85deb6",
        "room_id": "602b14fd541461fcab3686b5",
        "location": "110",
        "taskTitle": "Touch up paint",
        "taskDescription": "Paint is chipping behind headboard, please repaint.",
        "department": "Maintenance",
        ...
      }
    ]
  },
  {
    "_id": "602b3db794bd6e1e4f85ded1",
    "roomType_id": "602b118a541461fcab3686ac",
    "reservation_id": "",
    "roomType": "Ocean View King Suite",
    "price": "400.00",
    "amenities": [
      "Ocean View",
      "TV",
      "Non-Smoking"
    ],
    "roomNumber": "111",
    "floorNumber": 1,
    "currentGuests": [],
    "isOccupied": false,
    "isUsable": true,
    "isClean": true,
    "tasks": []
  },
  {
    "_id": "602b1f2694bd6e1e4f85de88",
    "roomType_id": "602b1139541461fcab3686ab",
    "reservation_id": "",
    ...
  }
]
```