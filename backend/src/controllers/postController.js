const postService = require('../services/postService');
const AppError = require('../utils/AppError');

exports.createPost = async (req, res, next) => {
  try {
    const { content, scope } = req.body;
    if (!content || content.length < 10) {
      throw new AppError('Post content must be at least 10 characters long', 400);
    }

    const post = await postService.createPost(content, req.user.userId, scope);
    res.status(201).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const { scope = 'COLLEGE', limit = 10, cursor = null } = req.query;
    let universityId = req.user.universityId;
    if (!universityId) {
      const { getUserMe } = require('../services/authService');
      const user = await getUserMe(req.user.userId);
      universityId = user.university?.id;
    }

    if (!universityId) throw new AppError('You must join a university to view the feed', 400);

    const result = await postService.getPosts(universityId, scope, limit, cursor);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id, req.user.userId);
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    await postService.deletePost(req.params.id, req.user.userId);
    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

exports.toggleLike = async (req, res, next) => {
  try {
    const result = await postService.toggleLike(req.params.id, req.user.userId);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};
