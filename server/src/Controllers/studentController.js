import { processStudentAdmission } from '../services/studentService.js'; // Ensure this path matches where Source 19 is saved
import StudentEnrollment from '../models/StudentEnrollment.js';
import { processStudentPromotion } from '../services/studentPromotionService.js';
export const registerAdmission = async (req, res, next) => {
  try {
    // We expect the body to contain studentDetails, an array of guardianDetails, and enrollmentDetails
    // just like your service requires[cite: 19].
    const admissionData = req.body; 
    const userId = req.user._id; // Pulled from the protect middleware[cite: 24]

    // Send everything to your transaction-safe service[cite: 19]
    const newStudent = await processStudentAdmission(admissionData, userId);

    res.status(201).json({
      success: true,
      message: 'Student registered and enrolled successfully',
      data: { studentId: newStudent._id, admissionNumber: newStudent.admissionNumber }
    });
  } catch (error) {
    next(error);
  }
};

export const getEnrolledStudents = async (req, res, next) => {
  try {
    const { academicYearId, sectionId } = req.query;
    const query = {};
    if (academicYearId) query.academicYear = academicYearId;
    if (sectionId) query.section = sectionId;

    const enrollments = await StudentEnrollment.find(query)
      // Populating the reverse relationship to get guardians[cite: 23]
      .populate({ path: 'student' }) 
      .populate('class', 'name')
      .populate('section', 'name');

    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    next(error);
  }
};

export const promoteStudents = async (req, res, next) => {
  try {
    const promotionResults = await processStudentPromotion(req.body, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Student promotion process completed successfully',
      data: promotionResults
    });
  } catch (error) {
    next(error);
  }
};