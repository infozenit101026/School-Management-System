import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  }, // e.g., 'student:create', 'marks:update'
  description: { 
    type: String 
  },
  module: { 
    type: String, 
    required: true 
  } // e.g., 'Students', 'Marks', 'Fees'
}, { timestamps: true });

export default mongoose.model('Permission', permissionSchema);