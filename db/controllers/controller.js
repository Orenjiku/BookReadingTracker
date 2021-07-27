const db = require('../models/index');

module.exports = {
  getUsers: async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM user_profile ORDER BY id ASC');
      res.status(200).json(result.rows);
    } catch (err) {
      res.sendStatus(400);
    }
  }
}