const express = require('express');
const noteController = require('../controllers/notes.controller');
const auth = require('../middleware/auth');
const { validateNoteInput, aiRateLimiter } = require("../middleware/aiGuards");

const router = express.Router();

router.post('/:id/ai/analyze', auth, aiRateLimiter, noteController.analyzeNote);
router.post('/', auth, noteController.createNote);
router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNoteById);
router.put('/:id', auth, noteController.updateNote);
router.delete('/:id', auth, noteController.deleteNote);

module.exports = router;
