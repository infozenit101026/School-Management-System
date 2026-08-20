import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { 
  createNotification, 
  getMyNotifications, 
  markAsRead 
} from '../controllers/notificationController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes for the authenticated user to view and manage their own notifications
router.get('/my-notifications', getMyNotifications);
router.patch('/:notificationId/read', markAsRead);

// Management route: Only specific roles can dispatch system-wide notifications
router.post(
  '/', 
  authorize('ADMIN', 'SCHOOL_MANAGER', 'STAFF_MANAGER'), 
  createNotification
);

export default router;