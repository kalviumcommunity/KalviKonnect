const announcementService = require('../services/announcementService');
const AppError = require('../utils/AppError');

exports.createAnnouncement = async (req, res, next) => {
  try {
    const { userId, role } = req.user;
    const data = await announcementService.createAnnouncement(req.body, userId, role);
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

exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;
    await announcementService.deleteAnnouncement(id, userId, role);
    res.status(200).json({ success: true, message: 'Announcement deleted' });
  } catch (err) {
    next(err);
  }
};
