const discussionService = require('../services/discussionService');

exports.createThread = async (req, res, next) => {
  try {
    const data = await discussionService.createThread(req.body, req.user.id);
    res.status(201).json({ error: false, data });
  } catch (err) {
    next(err);
  }
};

exports.getThreads = async (req, res, next) => {
  try {
    const data = await discussionService.getThreads(req.query);
    res.status(200).json({ error: false, ...data });
  } catch (err) {
    next(err);
  }
};

exports.reply = async (req, res, next) => {
  try {
    const data = await discussionService.replyToThread(req.params.id, req.body.content, req.user.id);
    res.status(201).json({ error: false, data });
  } catch (err) {
    next(err);
  }
};
