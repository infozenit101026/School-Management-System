import mongoose from 'mongoose';
import Student from '../models/Student.js';
import Guardian from '../models/Guardian.js';
import StudentEnrollment from '../models/StudentEnrollment.js';
import AuditLog from '../models/AuditLog.js';

export const processStudentAdmission = async (admissionData, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { studentDetails, guardianDetails, enrollmentDetails } = admissionData;

    // 1. Create Student
    const newStudent = await Student.create([studentDetails], { session });
    const studentId = newStudent[0]._id;

    // 2. Create Guardians (maps array of guardians)
    const guardiansToCreate = guardianDetails.map(g => ({
      ...g,
      studentId
    }));
    await Guardian.insertMany(guardiansToCreate, { session });

    // 3. Create Student Enrollment
    await StudentEnrollment.create([{
      student: studentId,
      academicYear: enrollmentDetails.academicYearId,
      class: enrollmentDetails.classId,
      section: enrollmentDetails.sectionId,
      rollNumber: enrollmentDetails.rollNumber
    }], { session });

    // 4. Create Audit Log
    await AuditLog.create([{
      user: userId,
      action: 'CREATE',
      module: 'Student Admission',
      recordId: studentId,
      newValue: { admissionNumber: studentDetails.admissionNumber, class: enrollmentDetails.classId }
    }], { session });

    // 5. Commit Transaction
    await session.commitTransaction();
    session.endSession();

    return newStudent[0];

  } catch (error) {
    // If any failure occurs, rollback the entire database transaction
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Admission failed: ${error.message}`);
  }
};