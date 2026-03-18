const express = require('express');
const hackathonController = require('../controllers/hackathonController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, hackathonController.createHackathon);
router.get('/', auth, hackathonController.getHackathons);
router.patch('/:id/status', auth, hackathonController.updateStatus);
router.post('/:id/apply', auth, hackathonController.applyToHackathon);

module.exports = router;
