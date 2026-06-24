import express from 'express';
import { protect } from '../middleware/auth.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.get('/:id', protect, userController.getUser);
router.put('/:id', protect, userController.updateUser);
router.put('/:id/preferences', protect, userController.updatePreferences);
router.get('/:id/stats', protect, userController.getUserStats);
router.post('/:id/avatar', protect, userController.uploadAvatar);
router.delete('/:id/account', protect, userController.deleteAccount);

export default router;
