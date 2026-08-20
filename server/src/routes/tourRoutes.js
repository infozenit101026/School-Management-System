import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { createTour, getTours, registerStudentForTour } from '../controllers/tourController.js';

const router = express.Router();

router.use(protect);

router.get('/', getTours);
router.post('/', authorize('ADMIN', 'SCHOOL_MANAGER'), createTour);
router.post('/:id/register', authorize('ADMIN', 'STAFF', 'SCHOOL_MANAGER'), registerStudentForTour);

export default router;