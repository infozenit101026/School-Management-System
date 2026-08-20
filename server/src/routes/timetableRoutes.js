import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { 
  setDayTimetable, 
  getClassTimetable, 
  getTeacherSchedule 
} from '../controllers/timetableController.js';

const router = express.Router();

router.use(protect);

router.get('/class/:classId/section/:sectionId', getClassTimetable);
router.get('/teacher/:staffId', getTeacherSchedule);

router.post(
  '/', 
  authorize('ADMIN', 'SCHOOL_MANAGER', 'STAFF_MANAGER'), 
  setDayTimetable
);

export default router;