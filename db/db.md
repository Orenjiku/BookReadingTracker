# Constraints
| Num | Constraint | Template | Example |
| --- | ---------- | -------- | ------- |
| 1 | primary key | pk_{table_name} | pk_user_profile |
| 2 | foreign key | fk_{foreign_key_table_name}_{primary_key_table_name} | fk_user_profile_user_profile_book |
| 3 | unique | uq_{table_name}_{col_name} | uq_user_profile_username |
| 4 | check | ck_{table_name}_{col_name} | ck_book_total_pages |
| 5 | index | ix_{table_name}_{col_name} |