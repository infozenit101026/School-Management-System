import Examination from '../models/Examination.js';
import Mark from '../models/Mark.js';
import { calculateGrade } from '../services/markService.js';

export const createExam = async (req, res, next) => {
  try {
    const { name, academicYear, startDate, endDate, isActive } = req.body;
    const exam = await Examination.create({ name, academicYear, startDate, endDate, isActive });
    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

// Fetch all Exams for an Academic Year
export const getExamsByYear = async (req, res, next) => {
  try {
    const { academicYearId } = req.params;
    const exams = await Examination.find({ academicYear: academicYearId }).sort({ startDate: 1 });
    res.status(200).json({ success: true, data: exams });
  } catch (error) {
    next(error);
  }
};

// Enter or update batch marks for a class section subject
export const enterBatchMarks = async (req, res, next) => {
  try {
    const { examination, academicYear, classId, sectionId, subjectId, maximumMarks = 100, marksData } = req.body;

    const bulkOps = marksData.map(item => {
      // Calculate grade based on obtainedMarks and maximumMarks
      const percentage = (item.obtainedMarks / maximumMarks) * 100;
      const grade = calculateGrade(percentage);

      return {
        updateOne: {
          filter: { 
            examination, 
            student: item.studentId, 
            subject: subjectId 
          },
          update: {
            // $set applies to both new and updated records
            $set: {
              academicYear,
              class: classId,
              section: sectionId,
              obtainedMarks: item.obtainedMarks,
              maximumMarks,
              grade,
              remarks: item.remarks || '',
              updatedBy: req.user._id // Track who modified it last
            },
            // $setOnInsert only applies when creating a brand new record
            $setOnInsert: {
              enteredBy: req.user._id 
            }
          },
          upsert: true
        }
      };
    });

    const result = await Mark.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: 'Marks recorded and graded successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Get report card marks for a specific student in an exam
export const getStudentMarks = async (req, res, next) => {
  try {
    const { studentId, examinationId } = req.params;

    const marks = await Mark.find({ student: studentId, examination: examinationId })
      .populate('subject', 'name code')
      .populate('examination', 'name')
      .populate('enteredBy', 'username');

    res.status(200).json({ success: true, data: marks });
  } catch (error) {
    next(error);
  }
};