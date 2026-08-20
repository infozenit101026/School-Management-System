import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {upsertSalaryStructure, generatePayroll, getPayrollHistory, markPayrollAsPaid } from '../controllers/payrollController.js';

const router = express.Router();

router.use(protect, authorize('ADMIN', 'STAFF_MANAGER', 'ACCOUNTANT'));
router.post('/structure', upsertSalaryStructure);
router.post('/', generatePayroll);
router.get('/staff/:staffId', getPayrollHistory);
router.patch('/:id/pay', markPayrollAsPaid);

export default router;