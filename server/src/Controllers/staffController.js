import mongoose from 'mongoose';
import Staff from '../models/Staff.js';
import User from '../models/User.js';
import StaffAssignment from '../models/StaffAssignment.js';

// Create a new Staff member and linked User account
export const createStaff = async (req, res, next) => {
  try {
    const { username, password, role, ...staffDetails } = req.body;

    // 1. Create User account for authentication
    const user = await User.create({
      username,
      email: staffDetails.email,
      password,
      role: role || 'STAFF'
    });

    // 2. Create Staff profile (linking the newly created user's ID)
    const staff = await Staff.create({
      ...staffDetails,
      user: user._id
    });

    res.status(201).json({
      success: true,
      message: 'Staff profile and user account created successfully',
      data: staff
    });
  } catch (error) {
    // If the creation fails (e.g., duplicate email), pass it to the error handler
    next(error);
  }
};

// Fetch all staff members
export const getAllStaff = async (req, res, next) => {
  try {
    const staff = await Staff.find().populate('user', 'username role isActive');
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    next(error);
  }
};

// Assign a teacher to a class section and subject
export const assignTeacherToSubject = async (req, res, next) => {
  try {
    const { staff, academicYear, classId, sectionId, subject } = req.body;

    const assignment = await StaffAssignment.create({
      staff,
      academicYear,
      classId,
      sectionId,
      subject
    });

    res.status(201).json({
      success: true,
      message: 'Teacher assigned to subject successfully',
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

// Get assignments for a specific section
export const getSectionAssignments = async (req, res, next) => {
  try {
    const { sectionId, academicYearId } = req.params;

    const assignments = await StaffAssignment.find({
      sectionId,
      academicYear: academicYearId
    })
      .populate('staff', 'fullName employeeId designation')
      .populate('subject', 'name code')
      .populate('classId', 'name')
      .populate('sectionId', 'name');

    res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    next(error);
  }
};