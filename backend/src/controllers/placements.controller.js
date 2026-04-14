const placementService = require('../services/placements.service');

exports.analyzePlacement = async (req, res, next) => {
  try {
    const result = await placementService.analyzePlacementWithAI(req.params.id);
    // Always return 200 - let the frontend handle success/failure state
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.createPlacement = async (req, res, next) => {
  try {
    let universityId = req.user.universityId;
    const prisma = require('../db');
    
    if (!universityId) {
      const currentUser = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { universityId: true }
      });
      universityId = currentUser?.universityId;
    }

    if (!universityId) {
      const firstUniv = await prisma.university.findFirst();
      universityId = firstUniv?.id;
    }

    // Still no universityId? We need a real fallback
    if (!universityId) {
       // Create a default if somehow none exist
       const defaultUniv = await prisma.university.upsert({
         where: { name: 'Kalvium University' },
         update: {},
         create: { name: 'Kalvium University', location: 'Hybrid' }
       });
       universityId = defaultUniv.id;
    }

    const placementData = {
      ...req.body,
      universityId: universityId,
      fileUrls: req.body.fileUrls || []
    };
    const data = await placementService.createPlacement(placementData, req.user.userId);

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getPlacements = async (req, res, next) => {
  try {
    const data = await placementService.getPlacements(req.query);
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

exports.getPlacementById = async (req, res, next) => {
  try {
    const placement = await placementService.getPlacementById(req.params.id);
    res.status(200).json({ success: true, data: placement });
  } catch (err) {
    next(err);
  }
};

exports.deletePlacement = async (req, res, next) => {
  try {
    await placementService.deletePlacement(req.params.id, req.user.userId);
    res.status(200).json({ success: true, message: 'Placement deleted' });
  } catch (err) {
    next(err);
  }
};
