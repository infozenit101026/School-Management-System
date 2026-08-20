import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getAuditLogs } from '../controllers/auditController.js';

const router = express.Router();

// Only the top-level ADMIN can view system audit logs
router.use(protect, authorize('ADMIN'));

router.get('/', getAuditLogs);

export default router;