const express = require('express');
const discussionController = require('../controllers/discussionController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, discussionController.createThread);
router.get('/', discussionController.getThreads);
router.get('/:id', discussionController.getThreadById);
router.post('/:id/reply', auth, discussionController.reply);
router.delete('/:id', auth, discussionController.deleteThread);

module.exports = router;
