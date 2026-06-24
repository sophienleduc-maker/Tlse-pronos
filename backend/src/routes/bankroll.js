import express from 'express';
import { protect } from '../middleware/auth.js';
import * as bankrollController from '../controllers/bankrollController.js';

const router = express.Router();

router.get('/', protect, bankrollController.getUserBankroll);
router.get('/stats', protect, bankrollController.getBankrollStats);
router.get('/history', protect, bankrollController.getBankrollHistory);
router.get('/monthly', protect, bankrollController.getMonthlyStats);
router.get('/performance', protect, bankrollController.getPerformanceMetrics);

export default router;
