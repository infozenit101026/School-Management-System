import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: [
      'NEW_ADMISSION', 'FEE_DUE', 'FEE_PAYMENT', 'ATTENDANCE_SHORTAGE', 
      'EXAMINATION', 'RESULT_PUBLICATION', 'STAFF_ASSIGNMENT', 
      'TIMETABLE_CHANGE', 'EVENT', 'TOUR', 'SYSTEM_ANNOUNCEMENT'
    ], 
    required: true 
  }, // Types defined in the specifications
  
  // Target recipients (can be broad or specific)
  recipientUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  recipientRoles: [{ type: String }], // e.g., ['STAFF', 'STUDENT_MANAGER']
  
  isReadBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);