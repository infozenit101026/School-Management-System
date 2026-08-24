import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  registerAdmission,
  getEnrolledStudents,
  promoteStudents,
  getStudentById,
  updateStudent,
  deleteStudent
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

router
  .route("/:id")
  .get(getStudentById)
  .put(authorize("ADMIN", "SCHOOL_MANAGER", "STUDENT_MANAGER"), updateStudent)
  .delete(authorize("ADMIN", "SCHOOL_MANAGER", "STUDENT_MANAGER"), deleteStudent);

export default router;
