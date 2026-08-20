import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upsertMark, getStudentMarks } from '../controllers/markController.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('ADMIN', 'STAFF', 'SCHOOL_MANAGER'), upsertMark);
router.get('/student/:studentId', getStudentMarks);

export default router;