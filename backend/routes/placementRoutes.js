const express = require('express');
const placementController = require('../controllers/placementController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, placementController.createPlacement);
router.get('/', placementController.getPlacements);
router.get('/:id', placementController.getPlacementById);

module.exports = router;
