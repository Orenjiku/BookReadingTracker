const Pool = require('pg').Pool;
const dbConfig = require('../config/db.config.js');

module.exports = new Pool(dbConfig);