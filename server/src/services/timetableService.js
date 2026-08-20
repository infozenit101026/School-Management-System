import Timetable from '../models/TimeTable.js';

export const checkTeacherConflict = async (teacherId, day, startTime, endTime, academicYearId, currentClassId, currentSectionId) => {
  // Find timetables on this day for this academic year, EXCLUDING the current class/section being edited
  const schedules = await Timetable.find({ 
    day, 
    academicYear: academicYearId,
    $or: [
      { class: { $ne: currentClassId } },
      { section: { $ne: currentSectionId } }
    ],
    'periods.teacher': teacherId 
  });

  for (const schedule of schedules) {
    for (const period of schedule.periods) {
      if (period.teacher.toString() === teacherId.toString()) {
        // Simple string comparison for time (Assuming "09:00" 24-hour format)
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