const discussionService = require('../services/discussionService');

exports.createThread = async (req, res, next) => {
  try {
    const data = await discussionService.createThread(req.body, req.user.userId);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getThreads = async (req, res, next) => {
  try {
    const data = await discussionService.getThreads(req.query);
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

exports.getThreadById = async (req, res, next) => {
  try {
    const data = await discussionService.getThreadById(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.reply = async (req, res, next) => {
  try {
    const { content, isBlocker = false } = req.body;
    const data = await discussionService.replyToThread(req.params.id, content, req.user.userId, isBlocker);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.deleteThread = async (req, res, next) => {
  try {
    await discussionService.deleteThread(req.params.id, req.user.userId);
    res.status(200).json({ success: true, message: 'Thread deleted' });
  } catch (err) {
    next(err);
  }
};
