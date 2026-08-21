import AcademicYear from '../models/AcademicYear.js';
import Class from '../models/Class.js';
import Section from '../models/Section.js';
import Subject from '../models/Subject.js';
import ClassTeacherAssignment from '../models/ClassTeacherAssignment.js';
// --- ACADEMIC YEAR CONTROLLERS ---
export const createAcademicYear = async (req, res, next) => {
  try {
    const { year, startDate, endDate, isActive } = req.body;
    
    if (isActive) {
      await AcademicYear.updateMany({}, { isActive: false });
    }

    const newYear = await AcademicYear.create({ year, startDate, endDate, isActive });
    res.status(201).json({ success: true, data: newYear });
  } catch (error) {
    next(error);
  }
};

export const getAcademicYears = async (req, res, next) => {
  try {
    const years = await AcademicYear.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: years });
  } catch (error) {
    next(error);
  }
};

// --- CLASS CONTROLLERS ---
export const createClass = async (req, res, next) => {
  try {
    const { name, academicYear } = req.body;
    const newClass = await Class.create({ name, academicYear });
    res.status(201).json({ success: true, data: newClass });
  } catch (error) {
    next(error);
  }
};

export const getClassesByYear = async (req, res, next) => {
  try {
    const { academicYearId } = req.params;
    const classes = await Class.find({ academicYear: academicYearId }).populate('academicYear', 'year');
    res.status(200).json({ success: true, data: classes });
  } catch (error) {
    next(error);
  }
};

// --- SECTION CONTROLLERS ---
export const createSection = async (req, res, next) => {
  try {
    const { name, classId, academicYear, classTeacher, capacity } = req.body;
    const section = await Section.create({ name, classId, academicYear, classTeacher, capacity });
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

export const getSectionsByClass = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const sections = await Section.find({ classId })
      .populate('classId', 'name')
      .populate('classTeacher', 'username email');
    res.status(200).json({ success: true, data: sections });
  } catch (error) {
    next(error);
  }
};

// --- SUBJECT CONTROLLERS ---
export const createSubject = async (req, res, next) => {
  try {
    const { name, code, type, category } = req.body;
    const subject = await Subject.create({ name, code, type, category });
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

export const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    res.status(200).json({ success: true, data: subjects });
  } catch (error) {
    next(error);
  }
};

export const assignClassTeacher = async (req, res, next) => {
  try {
    const { staff, academicYear, classId, sectionId } = req.body;

    // 1. Create or update Class Teacher Assignment record
    const assignment = await ClassTeacherAssignment.findOneAndUpdate(
      { academicYear, sectionId },
      { staff, classId, assignedBy: req.user?._id },
      { new: true, upsert: true, runValidators: true }
    );

    // 2. Sync staff reference with the Section schema
    await Section.findByIdAndUpdate(sectionId, { classTeacher: staff });

    res.status(200).json({
      success: true,
      message: 'Class teacher assigned successfully',
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};