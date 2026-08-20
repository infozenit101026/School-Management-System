import Timetable from '../models/Timetable.js';

/**
 * Checks if a teacher is already booked for a specific day and time block.
 * @param {String} teacherId 
 * @param {String} day 
 * @param {String} startTime 
 * @param {String} endTime 
 * @param {String} academicYearId 
 * @returns {Boolean} true if conflict exists, false otherwise
 */
export const checkTeacherConflict = async (teacherId, day, startTime, endTime, academicYearId) => {
  // Find any timetables on this day for this academic year
  const schedules = await Timetable.find({ 
    day, 
    academicYear: academicYearId,
    'periods.teacher': teacherId 
  });

  for (const schedule of schedules) {
    for (const period of schedule.periods) {
      if (period.teacher.toString() === teacherId.toString()) {
        // Simple string comparison for time (assuming "09:00 AM" standard formatting)
        // In a production app, converting to date objects for overlap calculation is safer
        if (
          (startTime >= period.startTime && startTime < period.endTime) ||
          (endTime > period.startTime && endTime <= period.endTime) ||
          (startTime <= period.startTime && endTime >= period.endTime)
        ) {
          return true; // Conflict found
        }
      }
    }
  }

  return false; // No conflict
};