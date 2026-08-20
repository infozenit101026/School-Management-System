import StaffAttendance from '../models/StaffAttendance.js';
import Staff from '../models/Staff.js'; // <-- FIXED: Added Staff model import
import bcrypt from 'bcrypt'; // <-- FIXED: Added bcrypt for manual password checking

// Record or update daily attendance / Clock-in
export const clockIn = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    let attendance = await StaffAttendance.findOne({
      staffId: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (attendance) {
      attendance.status = req.body.status || 'PRESENT';
      if (req.body.remarks) attendance.remarks = req.body.remarks;
      await attendance.save();
    } else {
      attendance = await StaffAttendance.create({
        staffId: req.user._id,
        date: new Date(),
        status: req.body.status || 'PRESENT',
        checkInTime: new Date(),
        remarks: req.body.remarks
      });
    }

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

// Clock-out for the current day
export const clockOut = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await StaffAttendance.findOne({ 
      staffId: req.user._id, 
      date: { $gte: startOfDay, $lte: endOfDay } 
    });

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'No clock-in record found for today' });
    }

    attendance.checkOutTime = new Date();
    await attendance.save();

    res.status(200).json({ success: true, message: 'Clocked out successfully', data: attendance });
  } catch (error) {
    next(error);
  }
};

// Get attendance logs (Filtered by staff ID or date range)
export const getStaffAttendance = async (req, res, next) => {
  try {
    const { staffId, startDate, endDate } = req.query;
    let query = {};

    if (staffId) query.staffId = staffId;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const logs = await StaffAttendance.find(query)
      .populate('staffId', 'username email role fullName employeeId')
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};

export const kioskPunch = async (req, res, next) => {
  try {
    const { employeeId, password } = req.body;

    // 1. Find Staff and EXPLICITLY request the hidden password
    const staff = await Staff.findOne({ employeeId }).populate({
      path: 'user',
      select: '+password username role isActive' 
    });

    if (!staff || !staff.user) {
      return res.status(404).json({ success: false, message: 'Invalid Employee ID' });
    }

    // 2. Safely verify the password using bcrypt
    const isMatch = await bcrypt.compare(password, staff.user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect Password' });
    }

    // 3. Setup Time & Cutoffs for Today
    const now = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const lateCutoff = new Date();
    lateCutoff.setHours(8, 30, 0, 0); 
    const halfDayCutoff = new Date();
    halfDayCutoff.setHours(10, 0, 0, 0); 

    // 4. Check if they already have an attendance record for today
    let attendance = await StaffAttendance.findOne({
      staffId: staff.user._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    // 5. PROCESS CLOCK-IN
    if (!attendance) {
      let status = 'PRESENT';
      if (now > halfDayCutoff) {
        status = 'HALF_DAY'; // <-- FIXED: Underscore instead of hyphen
      } else if (now > lateCutoff) {
        status = 'LATE';
      }

      attendance = await StaffAttendance.create({
        staffId: staff.user._id, // References the User account ID
        date: now,
        status: status,
        checkInTime: now
      });

      return res.status(200).json({
        success: true,
        action: 'CLOCKED_IN',
        message: `Welcome, ${staff.fullName}! Clocked in as ${status}.`,
        data: attendance
      });
    } 
    
    // 6. PROCESS CLOCK-OUT
    else if (!attendance.checkOutTime) {
      attendance.checkOutTime = now;
      await attendance.save();

      return res.status(200).json({
        success: true,
        action: 'CLOCKED_OUT',
        message: `Goodbye, ${staff.fullName}! Successfully clocked out.`,
        data: attendance
      });
    } 
    
    // 7. ALREADY FINISHED
    else {
      return res.status(400).json({
        success: false,
        message: `${staff.fullName}, you have already clocked out for today!`
      });
    }

  } catch (error) {
    console.error("Kiosk Error:", error);
    next(error);
  }
};