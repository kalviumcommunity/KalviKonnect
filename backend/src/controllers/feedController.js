const feedService = require('../services/feedService');
const AppError = require('../utils/AppError');

exports.getDashboardFeed = async (req, res, next) => {
  try {
    const universityId = req.user.universityId; // assuming req.user is set by auth middleware
    if (!universityId) {
      throw new AppError('User university not found', 400);
    }
    
    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor || null;
    const result = await feedService.getDashboardFeed(universityId, limit, cursor);
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};
