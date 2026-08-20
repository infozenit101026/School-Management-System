import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { 
  createEvent, 
  getUpcomingEvents, 
  updateEventStatus,
  registerStudents
} from '../controllers/eventController.js';

const router = express.Router();

router.use(protect);

router.get('/upcoming', getUpcomingEvents);

// Event Management routes (Admins and Managers)
router.post('/', authorize('ADMIN', 'SCHOOL_MANAGER'), createEvent);
router.patch('/:eventId/status', authorize('ADMIN', 'SCHOOL_MANAGER'), updateEventStatus);

// Staff can register students
router.patch('/:eventId/register', authorize('ADMIN', 'SCHOOL_MANAGER', 'STAFF'), registerStudents);

export default router;