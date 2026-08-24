import Student from '../models/Student.js';
import Guardian from '../models/Guardian.js';
import StudentEnrollment from '../models/StudentEnrollment.js';
import AuditLog from '../models/AuditLog.js';

export const processStudentAdmission = async (admissionData, userId) => {
  let createdStudentId = null; // Track this so we can delete it if a later step fails

  try {
    // 1. DEFENSIVE DESTRUCTURING (Prevents crashes if frontend sends missing data)
    const studentDetails = admissionData.studentDetails || {};
    const guardianDetails = admissionData.guardianDetails || [];
    const enrollmentDetails = admissionData.enrollmentDetails || {};

    const currentYear = new Date().getFullYear();

    const acYearId = enrollmentDetails.academicYearId || enrollmentDetails.academicYear;
    const classId = enrollmentDetails.classId || enrollmentDetails.class;
    const sectionId = enrollmentDetails.sectionId || enrollmentDetails.section;

    if (!acYearId || !classId || !sectionId) {
      throw new Error("Missing academic year, class, or section ID in payload.");
    }

    // --- 2. AUTO-GENERATE ADMISSION & STUDENT IDs ---
    const lastStudent = await Student.findOne().sort({ createdAt: -1 });
    let nextSeq = 1;
    if (lastStudent && lastStudent.admissionNumber) {
      const parts = lastStudent.admissionNumber.split('-');
      if (parts.length === 3 && !isNaN(parts[2])) {
        nextSeq = parseInt(parts[2], 10) + 1;
      }
    }
    const sequenceString = nextSeq.toString().padStart(4, '0');
    studentDetails.admissionNumber = `ADM-${currentYear}-${sequenceString}`;
    studentDetails.studentId = `STU-${currentYear}-${sequenceString}`;

    // --- 3. CREATE STUDENT ---
    const newStudent = await Student.create(studentDetails);
    createdStudentId = newStudent._id; 

    // --- 4. CREATE GUARDIAN(S) ---
    if (guardianDetails.length > 0) {
      const guardiansToCreate = guardianDetails.map(g => ({ ...g, studentId: createdStudentId }));
      await Guardian.insertMany(guardiansToCreate);
    } else {
      throw new Error("At least one guardian is required for admission.");
    }

    // --- 5. ALPHABETICAL ROLL NUMBER CALCULATION ---
    const existingEnrollments = await StudentEnrollment.find({
      academicYear: acYearId,
      section: sectionId
    }).populate('student', 'fullName');

    const allStudentsInSection = [
      ...existingEnrollments
        .filter(e => e.student) 
        .map(e => ({
          enrollmentId: e._id,
          fullName: e.student.fullName,
          oldRollNumber: e.rollNumber
        })),
      {
        isNew: true,
        studentId: createdStudentId,
        fullName: studentDetails.fullName
      }
    ];

    allStudentsInSection.sort((a, b) => a.fullName.localeCompare(b.fullName));

    const tempBulkOps = [];
    const finalBulkOps = [];
    let newStudentRollNumber = 0;

    allStudentsInSection.forEach((item, index) => {
      const assignedRollNo = index + 1;
      
      if (item.isNew) {
        newStudentRollNumber = assignedRollNo;
      } else if (item.oldRollNumber !== assignedRollNo) {
        tempBulkOps.push({
          updateOne: {
            filter: { _id: item.enrollmentId },
            update: { $set: { rollNumber: -(item.oldRollNumber + 1000) } }
          }
        });
        finalBulkOps.push({
          updateOne: {
            filter: { _id: item.enrollmentId },
            update: { $set: { rollNumber: assignedRollNo } }
          }
        });
      }
    });

    if (tempBulkOps.length > 0) {
      await StudentEnrollment.bulkWrite(tempBulkOps);
      await StudentEnrollment.bulkWrite(finalBulkOps);
    }

    // --- 6. CREATE NEW ENROLLMENT ---
    await StudentEnrollment.create({
      student: createdStudentId,
      academicYear: acYearId,
      class: classId,
      section: sectionId,
      rollNumber: newStudentRollNumber
    });

    // --- 7. AUDIT LOG ---
    try {
      await AuditLog.create({
        user: userId,
        action: 'CREATE',
        module: 'Student Admission',
        recordId: createdStudentId,
        newValue: { admissionNumber: studentDetails.admissionNumber, rollNumber: newStudentRollNumber }
      });
    } catch (auditErr) {
      console.warn("Audit Log failed to save, but admission succeeded:", auditErr.message);
    }

    return newStudent;

  } catch (error) {
    console.error("--- ADMISSION FAILED ---");
    console.error(error);
    
    // MANUAL ROLLBACK: Delete the stranded data if the process crashes mid-way
    if (createdStudentId) {
      console.warn(`Rolling back: Deleting incomplete records for Student ID: ${createdStudentId}`);
      await Student.findByIdAndDelete(createdStudentId);
      await Guardian.deleteMany({ studentId: createdStudentId });
      await StudentEnrollment.deleteMany({ student: createdStudentId });
    }
    
    throw new Error(`Admission failed: ${error.message}`);
  }
};