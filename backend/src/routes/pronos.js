import express from 'express';
import { protect } from '../middleware/auth.js';
import * as pronoController from '../controllers/pronoController.js';

const router = express.Router();

// Public routes
router.get('/', pronoController.getAllPronos);
router.get('/search', pronoController.searchPronos);
router.get('/filter', pronoController.filterPronos);
router.get('/:id', pronoController.getPronoById);

// Protected routes
router.post('/:id/buy', protect, pronoController.buyProno);
router.get('/:id/buy-history', protect, pronoController.getUserPronoHistory);
router.post('/:id/rate', protect, pronoController.rateProno);

export default router;
