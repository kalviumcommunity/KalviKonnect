const express = require('express');
const bookmarkController = require('../controllers/bookmarkController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, bookmarkController.toggleBookmark);
router.get('/', auth, bookmarkController.getBookmarks);
router.delete('/:id', auth, bookmarkController.deleteBookmark);

module.exports = router;
