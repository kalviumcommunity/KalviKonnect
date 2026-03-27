const express = require('express');
const upvoteController = require('../controllers/upvoteController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, upvoteController.upvote);

module.exports = router;
