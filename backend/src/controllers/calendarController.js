const calendarService = require('../services/calendarService');

exports.getEvents = async (req, res, next) => {
  try {
    const events = await calendarService.getCalendarEvents(req);
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
};
