const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');

router.get('/login', authController.getLogin);
router.post('/login', authLimiter, authController.postLogin);

router.get('/register', authController.getRegister);
router.post('/register', authLimiter, authController.postRegister);

router.get('/logout', authController.logout);

router.get('/forgot-password', authController.getForgotPassword);
router.post('/forgot-password', authLimiter, authController.postForgotPassword);

router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authLimiter, authController.postResetPassword);

module.exports = router;
