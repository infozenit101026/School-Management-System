import StudentEnrollment from '../models/StudentEnrollment.js';
import FeeAssignment from '../models/FeeAssignment.js';

// Example: Class-wise Student Report[cite: 1]
export const getClasswiseStudentReport = async (req, res) => {
  try {
    const { academicYearId, classId, sectionId } = req.query;

    const query = { academicYear: academicYearId };
    if (classId) query.class = classId;
    if (sectionId) query.section = sectionId;

    const reportData = await StudentEnrollment.find(query)
      .populate('student', 'fullName admissionNumber status gender contactNumber')
      .populate('class', 'name')
      .populate('section', 'name')
      .sort({ 'class.name': 1, 'section.name': 1, rollNumber: 1 });

    res.status(200).json({ success: true, data: reportData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Report generation failed' });
  }
};

// Example: Fee Due/Pending Report[cite: 1]
export const getPendingFeeReport = async (req, res) => {
  try {
    const { academicYearId, classId } = req.query;
    
    // Aggregation to find students with PENDING or PARTIAL status[cite: 1]
    const reportData = await FeeAssignment.find({
      academicYear: academicYearId,
      status: { $in: ['PENDING', 'PARTIAL'] }
    })
    .populate('student', 'fullName admissionNumber contactNumber')
    .sort({ dueDate: 1 });

    res.status(200).json({ success: true, data: reportData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Fee report generation failed' });
  }
};