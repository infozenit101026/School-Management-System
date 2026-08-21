import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  createAcademicYear,
  getAcademicYears,
  createClass,
  getClassesByYear,
  createSection,
  getSectionsByClass,
  createSubject,
  getSubjects,
  assignClassTeacher
} from "../controllers/academicController.js";

const router = express.Router();

// Apply global authentication check to all routes below
router.use(protect);

// Academic Years
router
  .route("/years")
  .get(getAcademicYears)
  .post(authorize("ADMIN", "SCHOOL_MANAGER"), createAcademicYear);

// Classes
router
  .route("/classes")
  .post(authorize("ADMIN", "SCHOOL_MANAGER"), createClass);
router.get("/classes/year/:academicYearId", getClassesByYear);

// Sections
router
  .route("/sections")
  .post(authorize("ADMIN", "SCHOOL_MANAGER"), createSection);
router.get("/sections/class/:classId", getSectionsByClass);

// Subjects
router
  .route("/subjects")
  .get(getSubjects)
  .post(authorize("ADMIN", "SCHOOL_MANAGER"), createSubject);

router
  .route("/class-teacher")
  .post(authorize("ADMIN", "SCHOOL_MANAGER"), assignClassTeacher);

export default router;
