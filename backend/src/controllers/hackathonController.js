const hackathonService = require('../services/hackathonService');

exports.createHackathon = async (req, res, next) => {
  try {
    const data = await hackathonService.createHackathon(req.body, req.user.userId, req.user.role);
    res.status(201).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

exports.getHackathons = async (req, res, next) => {
  try {
    const { status = 'OPEN' } = req.query;
    const data = await hackathonService.getHackathons(status);
    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

exports.applyToHackathon = async (req, res, next) => {
  try {
    const data = await hackathonService.applyToHackathon(req.params.id, req.user.userId, req.user.role, req.body);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getApplicants = async (req, res, next) => {
  try {
    const data = await hackathonService.getApplicants(req.params.id, req.user.userId, req.user.role);
    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

exports.hireApplicant = async (req, res, next) => {
  try {
    const data = await hackathonService.hireApplicant(req.params.id, req.user.userId, req.user.role);
    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

exports.updateHackathonStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) throw new AppError('Status is required', 400);

    const data = await hackathonService.updateHackathonStatus(req.params.id, req.user.userId, req.user.role, status);
    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteHackathon = async (req, res, next) => {
  try {
    await hackathonService.deleteHackathon(req.params.id, req.user.userId);
    res.status(200).json({
      success: true,
      message: 'Opportunity deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
