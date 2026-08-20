import Event from '../models/Event.js';

// Create a new school event
export const createEvent = async (req, res, next) => {
  try {
    const { 
      name, description, category, venue, date, 
      eligibleClasses, eligibleSections, fee, dueDate, 
      maxParticipants, coverImage 
    } = req.body;
    
    const event = await Event.create({
      name, description, category, venue, date,
      eligibleClasses: eligibleClasses || [],
      eligibleSections: eligibleSections || [],
      fee, dueDate, maxParticipants, coverImage,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// Get upcoming and ongoing events
export const getUpcomingEvents = async (req, res, next) => {
  try {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    const events = await Event.find({ 
      status: { $in: ['UPCOMING', 'ONGOING'] },
      date: { $gte: currentDate } 
    })
    .populate('createdBy', 'username')
    .populate('eligibleClasses', 'name')
    .populate('eligibleSections', 'name')
    .sort({ date: 1 });

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

// Update event status
export const updateEventStatus = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided' });
    }

    const event = await Event.findByIdAndUpdate(
      eventId, 
      { status }, 
      { new: true, runValidators: true }
    );

    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    res.status(200).json({ 
      success: true, 
      message: `Event status successfully updated to ${status}`,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// Register students to an event
export const registerStudents = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { studentIds } = req.body; // Array of student ObjectIds

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of student IDs' });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    // Validate max capacity if it's set
    if (event.maxParticipants) {
      // Calculate how many new students are being added that aren't already registered
      const existingSet = new Set(event.registeredStudents.map(id => id.toString()));
      let newAdditions = 0;
      
      studentIds.forEach(id => {
        if (!existingSet.has(id)) newAdditions++;
      });

      if (event.registeredStudents.length + newAdditions > event.maxParticipants) {
        return res.status(400).json({ 
          success: false, 
          message: `Cannot register students. Exceeds maximum capacity of ${event.maxParticipants}.` 
        });
      }
    }

    // $addToSet safely pushes elements only if they don't already exist in the array
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { registeredStudents: { $each: studentIds } } },
      { new: true }
    ).populate('registeredStudents', 'fullName admissionNumber');

    res.status(200).json({
      success: true,
      message: 'Students registered successfully',
      data: updatedEvent
    });
  } catch (error) {
    next(error);
  }
};