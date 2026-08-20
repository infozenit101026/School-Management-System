import Mark from '../models/Mark.js';
import { calculateGrade } from '../services/markService.js';

// Enter or update marks for a student in a specific subject and exam
export const upsertMark = async (req, res, next) => {
  try {
    const { 
      student, academicYear, classId, section, 
      subject, examination, maximumMarks, obtainedMarks, remarks 
    } = req.body;
    
    // 1. Enforce Validation Rules
    if (obtainedMarks < 0) {
      return res.status(400).json({ success: false, message: 'Obtained marks cannot be negative' });
    }
    if (obtainedMarks > maximumMarks) {
      return res.status(400).json({ success: false, message: 'Obtained marks exceed maximum marks' });
    }

    // 2. Auto-calculate the grade securely on the backend
    const grade = calculateGrade(obtainedMarks, maximumMarks);

    // 3. Upsert the record
    const mark = await Mark.findOneAndUpdate(
      { student, subject, examination },
      { 
        academicYear, 
        class: classId, 
        section, 
        maximumMarks, 
        obtainedMarks, 
        grade, // Save the calculated grade
        remarks, 
        updatedBy: req.user._id,
        $setOnInsert: { enteredBy: req.user._id } // Only set enteredBy when first created
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: mark });
  } catch (error) {
    next(error);
  }
};

// Get a student's marks (optionally filtered by a specific examination)
export const getStudentMarks = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { examinationId } = req.query; // Optional filter query
    
    const query = { student: studentId };
    if (examinationId) query.examination = examinationId;

    const marks = await Mark.find(query)
      .populate('subject', 'name code')
      .populate('examination', 'name type')
      .sort({ 'examination.date': -1, subject: 1 });
    
    res.status(200).json({ success: true, data: marks });
  } catch (error) {
    next(error);
  }
};