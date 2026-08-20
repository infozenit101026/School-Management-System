import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { applyLeave, getLeaveRequests, updateLeaveStatus } from '../controllers/leaveController.js';

const router = express.Router();

router.use(protect);

router.post('/apply', applyLeave);
router.get('/', getLeaveRequests);
router.patch('/:id/status', authorize('ADMIN', 'STAFF_MANAGER'), updateLeaveStatus);

export default router;