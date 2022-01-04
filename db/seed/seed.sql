/* CLI Command to run script: psql -h {hostname} -U {username} -f seed.sql */

/* --------------------------------------------- CREATE DATABASE --------------------------------------------- */
\set my_db test
DROP DATABASE IF EXISTS :my_db;
CREATE DATABASE :my_db;
\c :my_db

-- run sql script files
\i ./createTables.sql;
\i ./createFunctions.sql;
\i ./insertReader.sql;
\i ./insert2021.sql;
\i ./insert2022.sql;
\i ./cleanUp.sql;