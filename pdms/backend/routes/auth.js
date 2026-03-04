const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// POST /api/auth/register
router.post(
    '/register',
    validate([
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
    ]),
    authController.register
);

// POST /api/auth/login
router.post(
    '/login',
    validate([
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ]),
    authController.login
);

// GET /api/auth/me
router.get('/me', auth, authController.getMe);

module.exports = router;
