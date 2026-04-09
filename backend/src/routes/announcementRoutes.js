const express = require('express');
const announcementController = require('../controllers/announcementController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.post('/', auth, roleCheck(['CAMPUS_MANAGER']), announcementController.createAnnouncement);
router.get('/', announcementController.getAnnouncements);
router.delete('/:id', auth, roleCheck(['CAMPUS_MANAGER']), announcementController.deleteAnnouncement);

module.exports = router;
