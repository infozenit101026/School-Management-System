import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { 
  createExam, 
  getExamsByYear, 
  enterBatchMarks, 
  getStudentMarks 
} from '../controllers/examController.js';

const router = express.Router();

// Apply global authentication check
router.use(protect);

// --- EXAM MANAGEMENT ---
router.route('/')
  .post(authorize('ADMIN', 'SCHOOL_MANAGER'), createExam);

router.route('/year/:academicYearId')
  .get(getExamsByYear);

// --- MARKS MANAGEMENT ---
router.route('/marks/batch')
  .post(authorize('ADMIN', 'SCHOOL_MANAGER', 'STAFF'), enterBatchMarks);

router.route('/marks/student/:studentId/exam/:examinationId')
  .get(getStudentMarks);

export default router;