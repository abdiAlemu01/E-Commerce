import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
} from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { authLimiter, passwordResetLimiter, emailVerificationLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/update-password', protect, updatePassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', protect, emailVerificationLimiter, resendVerificationEmail);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/refresh-token', refreshToken);

export default router;
