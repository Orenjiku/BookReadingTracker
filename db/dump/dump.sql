/* CLI Command to run script: psql -h {hostname} -U {username} -f {file_name.sql} */

/* --------------------------------------------- CREATE DATABASE --------------------------------------------- */
\set my_db test
DROP DATABASE IF EXISTS :my_db;
CREATE DATABASE :my_db;
\c :my_db

-- run sql script files
\i ./create.sql;
\i ./insert.sql;