const express = require('express');
const placementController = require('../controllers/placements.controller');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/aiGuards');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/:id/ai/analyze', auth, aiRateLimiter, placementController.analyzePlacement);
router.post('/', auth, upload.single('file'), placementController.createPlacement);
router.get('/', placementController.getPlacements);
router.get('/:id', placementController.getPlacementById);
router.delete('/:id', auth, placementController.deletePlacement);

module.exports = router;
