import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { markBatchAttendance, getSectionAttendance } from '../controllers/attendanceController.js';

const router = express.Router();

router.use(protect);

router.post(
  '/batch', 
  authorize('ADMIN', 'SCHOOL_MANAGER', 'STAFF'), 
  markBatchAttendance
);

router.get('/section', getSectionAttendance);

export default router;