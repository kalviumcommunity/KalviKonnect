const express = require('express');
const feedController = require('../controllers/feedController');
const auth = require('../middleware/auth');

const router = express.Router();

// Mount the buggy feed endpoint
router.get('/dashboard', auth, feedController.getDashboardFeed);

module.exports = router;
