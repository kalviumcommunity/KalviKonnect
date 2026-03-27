const bookmarkService = require('../services/bookmarkService');

exports.createBookmark = async (req, res, next) => {
  try {
    const data = await bookmarkService.createBookmark(req.user.id, req.body);
    res.status(201).json({ error: false, data });
  } catch (err) {
    next(err);
  }
};

exports.getBookmarks = async (req, res, next) => {
  try {
    // ETag logic using user's updatedAt
    const etag = `W/"${req.user.updatedAt.getTime()}"`;
    if (req.headers['if-none-match'] === etag) {
      return res.status(304).end();
    }

    const data = await bookmarkService.getBookmarks(req.user.id, req.query);
    res.setHeader('ETag', etag);
    res.status(200).json({ error: false, ...data });
  } catch (err) {
    next(err);
  }
};

exports.deleteBookmark = async (req, res, next) => {
  try {
    await bookmarkService.deleteBookmark(req.params.id, req.user.id);
    res.status(204).json({ error: false, data: null });
  } catch (err) {
    next(err);
  }
};
