const upvoteService = require('../services/upvoteService');

exports.toggleUpvote = async (req, res, next) => {
  try {
    const result = await upvoteService.toggleUpvote(req.user.userId, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
