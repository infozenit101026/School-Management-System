import Attendance from '../models/Attendance.js';
import { verifyAttendanceWindow } from '../services/attendanceService.js';

// Mark or update attendance in bulk for a whole class section
export const markBatchAttendance = async (req, res, next) => {
  try {
    const { academicYear, classId, sectionId, date, attendanceData } = req.body;

    // 1. Verify closing time window and handle audit logging if late[cite: 9]
    const userPermissions = req.user.permissions || [];
    await verifyAttendanceWindow(req.user._id, userPermissions);

    // 2. Normalize date to UTC midnight (00:00:00.000) for uniform indexing
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    // 3. Prepare bulk operations (Upsert pattern to allow re-marking without duplication)[cite: 8]
    const bulkOps = attendanceData.map(item => ({
      updateOne: {
        filter: { 
          student: item.studentId, 
          date: normalizedDate 
        },
        update: {
          $set: {
            academicYear,
            class: classId,
            section: sectionId,
            date: normalizedDate,
            status: item.status, // PRESENT, ABSENT, LATE, HALF_DAY, EXCUSED[cite: 8]
            markedBy: req.user._id,
            remarks: item.remarks || ''
          }
        },
        upsert: true
      }
    }));

    const result = await Attendance.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: 'Attendance recorded successfully',
      data: result
    });
  } catch (error) {
    if (error.message === 'ATTENDANCE_WINDOW_CLOSED') {
      return res.status(403).json({
        success: false,
        message: 'Attendance submission window has closed for today'
      });
    }
    next(error);
  }
};

// Retrieve daily attendance register for a specific section and date
export const getSectionAttendance = async (req, res, next) => {
  try {
    const { sectionId, date } = req.query;

    const queryDate = new Date(date);
    queryDate.setUTCHours(0, 0, 0, 0);

    const records = await Attendance.find({
      section: sectionId,
      date: queryDate
    })
      .populate('student', 'fullName admissionNumber studentId')
      .populate('markedBy', 'username');

    res.status(200).json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
};