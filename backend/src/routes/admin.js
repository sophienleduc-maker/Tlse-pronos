import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin authorization
router.use(protect, authorize('admin'));

// Prono management
router.post('/pronos', adminController.createProno);
router.put('/pronos/:id', adminController.updateProno);
router.put('/pronos/:id/result', adminController.setPronoResult);
router.delete('/pronos/:id', adminController.deleteProno);

// Refund management
router.post('/refunds/:pronoId', adminController.processRefund);
router.get('/refunds', adminController.getRefunds);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserDetails);
router.put('/users/:id/status', adminController.updateUserStatus);

// Statistics
router.get('/stats/overview', adminController.getOverviewStats);
router.get('/stats/revenue', adminController.getRevenueStats);
router.get('/stats/users', adminController.getUserStats);

export default router;
