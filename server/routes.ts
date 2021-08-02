const db = require('../db/controllers/controller');
const router = require('express').Router();

router.get('/', db.getReading);

module.exports = router;