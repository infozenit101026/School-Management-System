import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';

// 1. Import Staff Controllers
import { 
  createStaff, 
  getAllStaff, 
  assignTeacherToSubject, 
  getSectionAssignments 
} from '../controllers/staffController.js';

// 2. Import Attendance Controllers
import { 
  clockIn, 
  clockOut, 
  getStaffAttendance,
  kioskPunch 
} from '../controllers/staffAttendanceController.js';

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

// =================================================================
// 🚨 ATTENDANCE ROUTES
// These must come BEFORE any routes that use route parameters (like /:id)
// =================================================================
router.post('/attendance/kiosk', kioskPunch);
router.post('/attendance/clock-in', clockIn);
router.post('/attendance/clock-out', clockOut);
router.get('/attendance', getStaffAttendance);

// =================================================================
// 👥 STAFF DIRECTORY & ASSIGNMENT ROUTES
// =================================================================
router.route('/')
  .get(getAllStaff)
  .post(authorize('ADMIN', 'STAFF_MANAGER'), createStaff);

router.post(
  '/assign', 
  authorize('ADMIN', 'SCHOOL_MANAGER', 'STAFF_MANAGER'), 
  assignTeacherToSubject
);

router.post(
  "/assign-subject",
  authorize("ADMIN", "SCHOOL_MANAGER"),
  assignTeacherToSubject
);

router.get('/assignments/:academicYearId/:sectionId', getSectionAssignments);

export default router;