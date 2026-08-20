import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getAllUsers, toggleUserStatus } from '../controllers/userController.js';

const router = express.Router();

// Only Admins should manage users broadly
router.use(protect, authorize('ADMIN'));

router.get('/', getAllUsers);
router.patch('/:id/toggle-status', toggleUserStatus);

export default router;