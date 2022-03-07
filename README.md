# Readme

## **Installation Guidelines**
1. Clone this repo to your local machine.
2. Run yarn build
3. Create and populate PostgreSQL database.
      On the command line, enter
      ~~~~sql
        psql -h localhost -U username -f seed.sql
      ~~~~
      Replace username with your PostgreSQL username  
      More [database information](db/db.md) here.
4. Run yarn start
---

## **Video Demo**
[BookReadingTracker App Video](https://www.youtube.com/watch?v=6xjc2M_6hqk&ab_channel=Orenjiku)