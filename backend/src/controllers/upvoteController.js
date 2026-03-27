const upvoteService = require('../services/upvoteService');

exports.upvote = async (req, res, next) => {
  try {
    const upvote = await upvoteService.upvote(req.user.id, req.body);
    res.status(201).json({ error: false, data: upvote });
  } catch (err) {
    next(err);
  }
};
