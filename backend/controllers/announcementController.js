const announcementService = require('../services/announcementService');

exports.createAnnouncement = async (req, res, next) => {
  try {
    const data = await announcementService.createAnnouncement(req.body, req.user.id);
    res.status(201).json({ error: false, data });
  } catch (err) {
    next(err);
  }
};

exports.getAnnouncements = async (req, res, next) => {
  try {
    const data = await announcementService.getAnnouncements();
    res.status(200).json({ error: false, data });
  } catch (err) {
    next(err);
  }
};
