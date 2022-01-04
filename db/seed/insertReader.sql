/* --------------------------------------------- INSERT reader --------------------------------------------- */
-- DECLARE reader information
\set username_1 'Orenjiku'
\set user_password_1 'abc123'
\set user_token_1 '7A5F374B2247D4CBEE8E98181D21C'
\set first_name_1 'William'
\set middle_name_1 ''
\set last_name_1 'Chang'
\set email_1 'wdchang86@gmail.com'

-- INSERT data using FUNCTION insert_reader and DECLARED reader variables as arguments
SELECT insert_reader(:'username_1', :'user_password_1', :'user_token_1', :'first_name_1', :'middle_name_1', :'last_name_1', :'email_1');