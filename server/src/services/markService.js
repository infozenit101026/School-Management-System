// server/src/services/markService.js
import StudentEnrollment from '../models/StudentEnrollment.js';
import StaffAssignment from '../models/StaffAssignment.js';

export const validateAndSaveMarks = async (markData, teacherUserId) => {
  const { studentId, academicYearId, classId, sectionId, subjectId, obtainedMarks, maximumMarks } = markData;

  // Rule 1: Reject negative marks[cite: 1]
  if (obtainedMarks < 0) {
    throw new Error('OBTAINED_MARKS_CANNOT_BE_NEGATIVE');
  }

  // Rule 2: Reject if obtained is greater than maximum marks[cite: 1]
  if (obtainedMarks > maximumMarks) {
    throw new Error('OBTAINED_MARKS_EXCEED_MAXIMUM');
  }

  // Rule 3: Reject if student is not enrolled in the class[cite: 1]
  const isEnrolled = await StudentEnrollment.exists({
    student: studentId,
    academicYear: academicYearId,
    class: classId,
    section: sectionId
  });
  if (!isEnrolled) {
    throw new Error('STUDENT_NOT_ENROLLED_IN_CLASS');
  }

  // Rule 4: Reject if teacher is not authorized for the subject/class[cite: 1]
  // Assuming teacherUserId can be mapped to a staffId
  const isAuthorized = await StaffAssignment.exists({
    staff: teacherUserId, // Verify this maps to the correct staff document
    academicYear: academicYearId,
    classId: classId,
    sectionId: sectionId,
    subject: subjectId
  });
  
  // Need to bypass this check if the user is an ADMIN
  if (!isAuthorized) {
    throw new Error('TEACHER_NOT_AUTHORIZED_FOR_SUBJECT');
  }

  // If all validations pass, calculate grade (configurable) and save
  // ... proceed to database insertion
};

export const calculateGrade = (obtainedMarks, maximumMarks) => {
  if (maximumMarks === 0) return 'N/A';
  
  const percentage = (obtainedMarks / maximumMarks) * 100;

  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F'; 
};