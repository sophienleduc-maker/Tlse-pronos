import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password/:token', authController.resetPassword);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);

export default router;
