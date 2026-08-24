import { processStudentAdmission } from '../services/studentService.js'; 
import { processStudentPromotion } from '../services/studentPromotionService.js';
import Student from '../models/Student.js';
import StudentEnrollment from '../models/StudentEnrollment.js';
import Guardian from '../models/Guardian.js';

export const registerAdmission = async (req, res, next) => {
  try {
    const admissionData = req.body; 
    const userId = req.user._id; 

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
      .populate('student')
      .populate('class', 'name')
      .populate('section', 'name')
      .lean();

    const studentIds = enrollments.map(e => e.student?._id).filter(Boolean);
    const guardians = await Guardian.find({ studentId: { $in: studentIds } });

    const data = enrollments.map(item => ({
      ...item,
      guardian: guardians.find(g => g.studentId.toString() === item.student?._id?.toString())
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id).lean();
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const enrollment = await StudentEnrollment.findOne({ student: id })
      .populate('class', 'name')
      .populate('section', 'name')
      .populate('academicYear', 'year')
      .lean();

    const guardian = await Guardian.findOne({ studentId: id }).lean();

    res.status(200).json({
      success: true,
      data: { student, enrollment, guardian }
    });
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

export const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      fullName, 
      gender, 
      contactNumber, 
      address, 
      bloodGroup, 
      status,
      guardianName,
      enrollment 
    } = req.body;

    // 1. Update core Student details
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { fullName, gender, contactNumber, address, bloodGroup, status },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // 2. Update Student Enrollment if academic details were provided
    if (enrollment && enrollment.academicYear && enrollment.class && enrollment.section) {
      await StudentEnrollment.findOneAndUpdate(
        { student: id },
        { 
          academicYear: enrollment.academicYear,
          class: enrollment.class,
          section: enrollment.section
        },
        { new: true, runValidators: true }
      );
    }

    // 3. Update Guardian details (best effort based on standard fields)
    if (guardianName || contactNumber || address) {
      const guardianPayload = {};
      if (guardianName) guardianPayload.fullName = guardianName;
      if (contactNumber) guardianPayload.contactNumber = contactNumber;
      if (address) guardianPayload.address = address;

      await Guardian.findOneAndUpdate(
        { studentId: id },
        { $set: guardianPayload },
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({ success: true, data: updatedStudent });
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    await StudentEnrollment.deleteMany({ student: id });
    await Guardian.deleteMany({ studentId: id });

    res.status(200).json({ success: true, message: 'Student removed successfully' });
  } catch (error) {
    next(error);
  }
};