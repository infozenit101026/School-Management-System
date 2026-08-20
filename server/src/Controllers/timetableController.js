import Timetable from '../models/TimeTable.js';
import { checkTeacherConflict } from '../services/timetableService.js'; // Added import

// Upsert daily schedule for a class section
export const setDayTimetable = async (req, res, next) => {
  try {
    const { classId, sectionId, academicYear, day, periods } = req.body;

    // 1. Loop through all requested periods and check for teacher conflicts
    for (const period of periods) {
      const hasConflict = await checkTeacherConflict(
        period.teacher, 
        day, 
        period.startTime, 
        period.endTime, 
        academicYear,
        classId,
        sectionId
      );

      if (hasConflict) {
        return res.status(400).json({ 
          success: false, 
          message: `Scheduling Conflict: The teacher for period ${period.periodNumber} (${period.startTime} - ${period.endTime}) is already booked in another class at this time on ${day}.` 
        });
      }
    }

    // 2. If no conflicts, save the timetable
    const timetable = await Timetable.findOneAndUpdate(
      { class: classId, section: sectionId, academicYear, day },
      { periods },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: `Timetable for ${day} saved successfully`,
      data: timetable
    });
  } catch (error) {
    next(error);
  }
};

// Fetch full weekly timetable for a class section
export const getClassTimetable = async (req, res, next) => {
  try {
    const { classId, sectionId } = req.params;

    const timetable = await Timetable.find({ class: classId, section: sectionId })
      .populate('periods.subject', 'name code')
      .populate('periods.teacher', 'fullName employeeId')
      .sort({ day: 1 });

    res.status(200).json({ success: true, data: timetable });
  } catch (error) {
    next(error);
  }
};

// Fetch daily schedule for a specific staff member across all classes
export const getTeacherSchedule = async (req, res, next) => {
  try {
    const { staffId } = req.params;
    const { day, academicYearId } = req.query;

    const query = { 'periods.teacher': staffId };
    if (day) query.day = day;
    if (academicYearId) query.academicYear = academicYearId;

    const schedules = await Timetable.find(query)
      .populate('class', 'name')
      .populate('section', 'name')
      .populate('periods.subject', 'name code');

    // Filter out periods that don't belong to this specific teacher
    const formattedSchedules = schedules.map(schedule => {
      const teacherPeriods = schedule.periods.filter(p => p.teacher.toString() === staffId);
      return {
        _id: schedule._id,
        day: schedule.day,
        class: schedule.class,
        section: schedule.section,
        periods: teacherPeriods
      };
    });

    res.status(200).json({ success: true, data: formattedSchedules });
  } catch (error) {
    next(error);
  }
};