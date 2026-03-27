const placementService = require('../services/placementService');

exports.createPlacement = async (req, res, next) => {
  try {
    const data = await placementService.createPlacement(req.body, req.user.id);
    res.status(201).json({ error: false, data });
  } catch (err) {
    next(err);
  }
};

exports.getPlacements = async (req, res, next) => {
  try {
    const data = await placementService.getPlacements(req.query);
    res.status(200).json({ error: false, ...data });
  } catch (err) {
    next(err);
  }
};

exports.getPlacementById = async (req, res, next) => {
  try {
    const placement = await placementService.getPlacementById(req.params.id);
    res.status(200).json({ error: false, data: placement });
  } catch (err) {
    next(err);
  }
};
