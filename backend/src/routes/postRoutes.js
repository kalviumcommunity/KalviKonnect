const express = require('express');
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/', postController.createPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);
router.delete('/:id', postController.deletePost);
router.post('/:id/like', postController.toggleLike);

module.exports = router;
