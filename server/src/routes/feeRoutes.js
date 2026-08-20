import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { assignFee, getStudentFees, recordPayment } from '../controllers/feeController.js';

const router = express.Router();

router.use(protect);

router.post('/assignments', authorize('ADMIN', 'ACCOUNTANT'), assignFee);
router.get('/student/:studentId', getStudentFees);
router.post('/transactions', authorize('ADMIN', 'ACCOUNTANT'), recordPayment);

export default router;