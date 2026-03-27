const express = require('express');
const placementController = require('../controllers/placements.controller');
const auth = require('../middleware/auth');
const { validatePlacementInput, aiRateLimiter } = require("../middleware/aiGuards");

const router = express.Router();

router.post('/:id/structure', auth, aiRateLimiter, validatePlacementInput, placementController.structurePlacement);
router.post('/', auth, placementController.createPlacement);
router.get('/', placementController.getPlacements);
router.get('/:id', placementController.getPlacementById);

module.exports = router;
