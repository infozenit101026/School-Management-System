import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';

const router = express.Router();

// Apply global authentication check
router.use(protect);

// Anyone logged in can read the settings (needed to display the school name or check attendance cutoff)
router.get('/', getSettings);

// Only ADMIN and SCHOOL_MANAGER can change system settings
router.put('/', authorize('ADMIN', 'SCHOOL_MANAGER'), updateSettings);

export default router;