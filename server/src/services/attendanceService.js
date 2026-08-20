import SchoolSettings from '../models/SchoolSettings.js';
import AuditLog from '../models/AuditLog.js';

export const verifyAttendanceWindow = async (userId, userPermissions) => {
  let settings = await SchoolSettings.findOne(); 

  // Provide default settings if not configured in DB yet
  const closingTime = settings?.attendanceClosingTime || '12:00';
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); 

  if (currentTime > closingTime) {
    if (!userPermissions.includes('attendance:override')) {
      throw new Error('ATTENDANCE_WINDOW_CLOSED');
    }
    
    // Log late modification in the audit log (if AuditLog model exists)
    try {
      if (AuditLog) {
        await AuditLog.create({
          user: userId,
          action: 'ATTENDANCE_OVERRIDE',
          module: 'Attendance',
          recordId: userId,
          newValue: { timeSubmitted: currentTime, limit: closingTime }
        });
      }
    } catch (err) {
      console.warn('AuditLog warning:', err.message);
    }
  }
  return true;
};