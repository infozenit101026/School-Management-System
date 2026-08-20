import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getDashboardData } from '../controllers/dashboardController.js';

const router = express.Router();

// The controller handles the role-based routing internally
router.get('/', protect, getDashboardData);

export default router;