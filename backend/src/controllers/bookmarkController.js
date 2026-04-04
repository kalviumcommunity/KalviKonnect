const bookmarkService = require('../services/bookmarkService');

exports.toggleBookmark = async (req, res, next) => {
  try {
    const result = await bookmarkService.toggleBookmark(req.user.userId, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.getBookmarks = async (req, res, next) => {
  try {
    const data = await bookmarkService.getBookmarks(req.user.userId, req.query);
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

exports.deleteBookmark = async (req, res, next) => {
  try {
    await bookmarkService.deleteBookmark(req.params.id, req.user.userId);
    res.status(200).json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};
