import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { 
  createVehicle, 
  getVehicles, 
  createRoute, 
  getRoutes, 
  assignStudentToRoute 
} from '../controllers/transportController.js';

const router = express.Router();

router.use(protect);

// Vehicle Endpoints
router.route('/vehicles')
  .get(getVehicles)
  .post(authorize('ADMIN', 'TRANSPORT_MANAGER'), createVehicle);

// Route Endpoints
router.route('/routes')
  .get(getRoutes)
  .post(authorize('ADMIN', 'TRANSPORT_MANAGER'), createRoute);

// Assign student to a route
router.patch(
  '/routes/:routeId/assign', 
  authorize('ADMIN', 'TRANSPORT_MANAGER', 'STAFF'), 
  assignStudentToRoute
);

export default router;