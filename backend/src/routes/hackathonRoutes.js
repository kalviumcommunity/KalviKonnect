const express = require('express');
const hackathonController = require('../controllers/hackathonController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/', hackathonController.createHackathon);
router.get('/', hackathonController.getHackathons);
router.post('/:id/apply', hackathonController.applyToHackathon);
router.get('/:id/applicants', hackathonController.getApplicants);
router.patch('/applications/:id/hire', hackathonController.hireApplicant);

module.exports = router;
