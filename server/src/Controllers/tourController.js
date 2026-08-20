import Tour from '../models/Tour.js';

// Create a new educational tour
export const createTour = async (req, res, next) => {
  try {
    const { 
      name, destination, description, startDate, endDate, 
      eligibleClasses, tourFee, maxCapacity 
    } = req.body;

    const tour = await Tour.create({
      name, destination, description, startDate, endDate,
      eligibleClasses, tourFee, maxCapacity,
      organizedBy: req.user._id
    });

    res.status(201).json({ success: true, data: tour });
  } catch (error) {
    next(error);
  }
};

// Get all tours (with optional status filter)
export const getTours = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const tours = await Tour.find(query)
      .populate('eligibleClasses', 'name')
      .populate('organizedBy', 'username')
      .sort({ startDate: 1 });

    res.status(200).json({ success: true, count: tours.length, data: tours });
  } catch (error) {
    next(error);
  }
};

// Register a student for a tour
export const registerStudentForTour = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    const tour = await Tour.findById(id);
    if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });

    // Check capacity constraints
    if (tour.maxCapacity && tour.registeredStudents.length >= tour.maxCapacity) {
      return res.status(400).json({ success: false, message: 'Tour has reached maximum capacity' });
    }

    // Prevent duplicate registrations
    if (tour.registeredStudents.includes(studentId)) {
      return res.status(400).json({ success: false, message: 'Student is already registered' });
    }

    tour.registeredStudents.push(studentId);
    await tour.save();

    // Note: In a real-world scenario, you would also trigger a FeeAssignment creation here for the tourFee

    res.status(200).json({ success: true, message: 'Student registered successfully', data: tour });
  } catch (error) {
    next(error);
  }
};