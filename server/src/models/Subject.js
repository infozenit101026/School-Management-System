import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, trim: true },
  type: { type: String, enum: ['THEORY', 'PRACTICAL'], default: 'THEORY' },
  category: { type: String, enum: ['CORE', 'ELECTIVE'], default: 'CORE' }
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);