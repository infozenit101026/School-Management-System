import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { clockIn, clockOut, getStaffAttendance } from '../controllers/staffAttendanceController.js';

const router = express.Router();

router.use(protect);

router.post('/clock-in', clockIn);
router.post('/clock-out', clockOut);
router.get('/', authorize('ADMIN', 'STAFF_MANAGER', 'SCHOOL_MANAGER'), getStaffAttendance);

export default router;