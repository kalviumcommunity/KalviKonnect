const express = require('express');
const calendarController = require('../controllers/calendarController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, calendarController.getEvents);

module.exports = router;
