const db = require('../models/index');

module.exports = {


  // getBook: async (req, res) => {
  //   // const { user_id } = req.params;
  //   try {
  //     const result = await db.query('SELECT b.title, b.total_pages, b.blurb, b.picture_link, (SELECT json_agg(row_to_json(book_read)) AS book_read FROM (SELECT br.id, br.days_read, br.days_total, (SELECT json_agg(row_to_json(read_entry)) AS read_entry FROM (SELECT re.id, re.date_read, re.page_completed, re.percentage_completed FROM read_entry AS re WHERE re.book_read_id = br.id ORDER BY re.date_read DESC) AS read_entry) FROM book_read AS br INNER JOIN reader_book AS rb ON br.reader_book_id = rb.id WHERE rb.book_id = b.id AND rb.reader_id = 1  AND is_reading IS TRUE ORDER BY br.id DESC) AS book_read) FROM book AS b WHERE b.id = 11;');
  //     res.status(200).json(result.rows);
  //   } catch (err) {
  //     res.sendStatus(400);
  //   }
  // },

  getReading: async (req, res) => {
    const isReading = 'FALSE';
    try {
      const result = await db.query(`(SELECT json_agg(row_to_json(is_reading_agg)) AS is_reading FROM (SELECT b.title, b.total_pages, b.blurb, b.picture_link, (SELECT json_agg(row_to_json(book_read_agg)) AS book_read FROM (SELECT br.id, br.days_read, br.days_total, (SELECT json_agg(row_to_json(read_entry_agg)) AS read_entry FROM (SELECT re.id, re.date_read, re.page_completed, re.percentage_completed FROM read_entry AS re WHERE re.book_read_id = br.id ORDER BY re.date_read DESC) AS read_entry_agg) WHERE rb.book_id = b.id ORDER BY br.id DESC) AS book_read_agg) FROM book_read AS br INNER JOIN reader_book AS rb ON br.reader_book_id = rb.id INNER JOIN book AS b ON rb.book_id = b.id WHERE br.is_reading IS ${isReading} AND rb.reader_id = 1) AS is_reading_agg);`);
      res.status(200).json(result.rows);
    } catch (err) {
      res.sendStatus(400);
    }
  }
}