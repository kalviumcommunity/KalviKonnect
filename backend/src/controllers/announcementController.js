const announcementService = require('../services/announcementService');

const AppError = require('../utils/AppError');

exports.createAnnouncement = async (req, res, next) => {
  try {
    if (req.user.role !== 'CAMPUS_MANAGER') {
      throw new AppError('Only campus managers can create announcements', 403);
    }
    const data = await announcementService.createAnnouncement(req.body, req.user.userId);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getAnnouncements = async (req, res, next) => {
  try {
    const data = await announcementService.getAnnouncements(req.query);
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};
