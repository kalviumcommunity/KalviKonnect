const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('email')
      .isEmail().withMessage('Enter a valid email')
      .custom(value => {
        if (!value.endsWith('@kalvium.community')) {
          throw new Error('Only @kalvium.community emails are allowed');
        }
        return true;
      }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['STUDENT', 'MENTOR', 'CAMPUS_MANAGER']).withMessage('Invalid role'),
    body('universityId').notEmpty().withMessage('University ID is required'),
    validate,
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  authController.login
);

router.get('/me', auth, authController.getMe);

module.exports = router;
