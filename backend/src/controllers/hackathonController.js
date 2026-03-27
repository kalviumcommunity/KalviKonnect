const hackathonService = require('../services/hackathonService');

exports.createHackathon = async (req, res, next) => {
  try {
    const data = await hackathonService.createHackathon(req.body, req.user.id);
    res.status(201).json({ error: false, data });
  } catch (err) {
    next(err);
  }
};

exports.getHackathons = async (req, res, next) => {
  try {
    const data = await hackathonService.getHackathons(req.query);
    res.status(200).json({ error: false, ...data });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const data = await hackathonService.updateStatus(req.params.id, req.body.status, req.user.id);
    res.status(200).json({ error: false, data });
  } catch (err) {
    next(err);
  }
};

exports.applyToHackathon = async (req, res, next) => {
  try {
    const data = await hackathonService.applyToHackathon(req.params.id, req.user.id);
    res.status(200).json({ error: false, data });
  } catch (err) {
    next(err);
  }
};
