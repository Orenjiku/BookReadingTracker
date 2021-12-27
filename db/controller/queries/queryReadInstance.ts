import updateReaderBook from './helperQueries/updateReaderBook';
import updateReadInstance from './helperQueries/updateReadInstance';

const queryPostReadInstance = (readerBookId: number) => {
  return `
    INSERT INTO read_instance (reader_book_id) VALUES (${readerBookId});

    ${updateReaderBook(readerBookId)}
  `
};

const queryDeleteReadInstance = (readerBookId: number, readInstanceId: number) => {
  //1. if the number of read_instances > 1, delete read_instance.
  //2. if the number of read_instances === 1, delete read_entries of the read_instance.
  //3. update read_instance based on read_entry data.
  //4. update reader_book based on read_instance data.
  return `
    WITH cte AS (
            SELECT COUNT(id) AS count
            FROM read_instance AS ri
            WHERE ri.reader_book_id=${readerBookId}
    )
    DELETE FROM read_instance AS ri USING cte WHERE ri.id = ${readInstanceId} AND cte.count > 1;

    WITH cte AS (
            SELECT COUNT(id) AS count
            FROM read_instance AS ri
            WHERE ri.reader_book_id=${readerBookId}
    )
    DELETE FROM read_entry AS re USING cte WHERE re.read_instance_id = ${readInstanceId} AND cte.count = 1;

    ${updateReadInstance(readerBookId, readInstanceId)}

    ${updateReaderBook(readerBookId)}
  `
};

export { queryPostReadInstance, queryDeleteReadInstance }