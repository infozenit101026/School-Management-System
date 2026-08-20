import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: { 
    type: String, 
    enum: ['ADMIN', 'SCHOOL_MANAGER', 'STAFF_MANAGER', 'STUDENT_MANAGER', 'STAFF'], 
    required: true, 
    unique: true 
  },
  permissions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Permission' 
  }]
}, { timestamps: true });

export default mongoose.model('Role', roleSchema);