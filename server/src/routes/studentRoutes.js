import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  registerAdmission,
  getEnrolledStudents,
  promoteStudents
} from "../controllers/studentController.js";

const router = express.Router();

router.use(protect);

router.post(
  "/admission",
  authorize("ADMIN", "SCHOOL_MANAGER", "STUDENT_MANAGER"),
  registerAdmission,
);

router.get("/enrollments", getEnrolledStudents);

router.post(
  "/promote",
  authorize("ADMIN", "SCHOOL_MANAGER", "STUDENT_MANAGER"),
  promoteStudents,
);

export default router;
