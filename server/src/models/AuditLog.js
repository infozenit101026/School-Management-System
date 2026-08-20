import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  action: { type: String, required: true },   // e.g., "ATTENDANCE_OVERRIDE", "GRADE_UPDATE"[cite: 15]
  module: { type: String, required: true },   // e.g., "Attendance", "Examination"[cite: 15]
  recordId: { type: mongoose.Schema.Types.ObjectId },
  oldValue: { type: mongoose.Schema.Types.Mixed },
  newValue: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String }
}, { timestamps: true });

// Added Indexes for optimized administrative queries and log filtering
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ module: 1, action: 1 });
auditLogSchema.index({ user: 1 });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);