const db = require('../db/controllers/controller');
const router = require('express').Router();

router.get('/', db.getUsers);

module.exports = router;