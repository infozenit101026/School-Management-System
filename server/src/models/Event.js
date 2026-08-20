import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: {
    type: String,
    enum: ['ACADEMIC', 'SPORTS', 'CULTURAL', 'EXTRACURRICULAR', 'OTHER'],
    default: 'OTHER'
  },
  venue: { type: String, trim: true },
  date: { type: Date, required: true },
  
  eligibleClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  eligibleSections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
  
  fee: { 
    type: Number, 
    default: 0,
    min: [0, 'Fee cannot be negative'] 
  },
  dueDate: { type: Date },
  maxParticipants: {
    type: Number,
    min: [1, 'Must allow at least 1 participant if specified']
  },
  coverImage: { type: String },
  
  // Array to track which students are registered for this event
  registeredStudents: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student' 
  }],
  
  status: { 
    type: String, 
    enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'], 
    default: 'UPCOMING' 
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model('Event', eventSchema);