const db = require('../models/index');

module.exports = {
  getUsers: async (req, res) => {
    // const { user_id } = req.params;
    try {
      console.log('hello')
      const result = await db.query('SELECT * FROM book');
      res.status(200).json(result.rows);
    } catch (err) {
      res.sendStatus(400);
    }
  }

  // getBooks: async (req, res) => {
  //   try {
  //     const result = await db.query('SELECT b.title, b.total_pages FROM book b, user_profile_book a WHERE a.user_profile_id=2 AND a.book_id=b.id;');
  //     res.status(200).json(result.rows);
  //   } catch (err) {
  //     res.sendStatus(400);
  //   }
  // }
}