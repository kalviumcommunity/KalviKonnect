const feedService = require('../services/feedService');
const AppError = require('../utils/AppError');

exports.getDashboardFeed = async (req, res, next) => {
  try {
    const universityId = req.user.universityId; // assuming req.user is set by auth middleware
    if (!universityId) {
      throw new AppError('User university not found', 400);
    }
    
    const page = parseInt(req.query.page) || 1;
    const feed = await feedService.getDashboardFeed(universityId, page);
    
    res.status(200).json({
      status: 'success',
      data: {
        feed
      }
    });
  } catch (error) {
    next(error);
  }
};
