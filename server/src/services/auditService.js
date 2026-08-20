import AuditLog from '../models/AuditLog.js';

export const logAction = async ({ user, action, module, recordId, oldValue = null, newValue = null, ipAddress = null }, session = null) => {
  try {
    const logEntry = [{
      user,
      action, // e.g., 'CREATE', 'UPDATE', 'DELETE'
      module, // e.g., 'Student Fee', 'Marks'
      recordId,
      oldValue,
      newValue,
      ipAddress,
      timestamp: new Date()
    }];

    // Support Mongoose transactions if a session is provided
    if (session) {
      await AuditLog.create(logEntry, { session });
    } else {
      await AuditLog.create(logEntry[0]);
    }
  } catch (error) {
    console.error('Audit Log Failed:', error.message);
    // We intentionally do not throw here to prevent breaking the main transaction, 
    // unless strict audit compliance is required.
  }
};