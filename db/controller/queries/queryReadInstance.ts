import updateReaderBook from './helperQueries/updateReaderBook';
import updateReadInstance from './helperQueries/updateReadInstance';

const queryPostReadInstance = (readerBookId: number) => {
  return `
    CREATE OR REPLACE PROCEDURE post_read_instance(arg_reader_book_id INT)
    LANGUAGE plpgsql AS $$
    BEGIN
        INSERT INTO read_instance (is_reading, reader_book_id) VALUES (true, $1);
    END;
    $$;

    CALL post_read_instance(${readerBookId});

    DROP PROCEDURE post_read_instance;

    ${updateReaderBook(readerBookId)}
  `
};

const queryDeleteReadInstance = (readerBookId: number, readInstanceId: number) => {
  //1. delete read_instance if read_instance count > 1, else delete all read_entry for the single read_instance.
  //2. update read_instance based on read_entry data.
  //3. update reader_book based on read_instance data.
  return `
    CREATE OR REPLACE PROCEDURE delete_read_instance(reader_book_id INT, read_instance_id INT)
    LANGUAGE plpgsql AS $$
    DECLARE
        var_read_instance_count INT = (SELECT COUNT(id) AS count FROM read_instance AS ri WHERE ri.reader_book_id=$1);
    BEGIN
        IF (var_read_instance_count > 1) THEN
            DELETE FROM read_instance AS ri WHERE ri.id = $2;
        ELSE
            DELETE FROM read_entry AS re  WHERE re.read_instance_id = $2;
        END IF;
    END;
    $$;

    CALL delete_read_instance(${readerBookId}, ${readInstanceId});

    DROP PROCEDURE delete_read_instance;

    ${updateReadInstance(readerBookId, readInstanceId)}

    ${updateReaderBook(readerBookId)}
  `
};

export { queryPostReadInstance, queryDeleteReadInstance }