import Vehicle from '../models/Vehicle.js';
import Route from '../models/Route.js';
import VehicleAssignment from '../models/VehicleAssignment.js'; // Added import

// =======================
// VEHICLE MANAGEMENT
// =======================

export const createVehicle = async (req, res, next) => {
  try {
    const { registrationNumber, capacity, driver, attendant, status } = req.body;
    const vehicle = await Vehicle.create({ registrationNumber, capacity, driver, attendant, status });
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

export const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find()
      .populate('driver', 'fullName contactNumber employeeId') 
      .populate('attendant', 'fullName contactNumber employeeId');
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    next(error);
  }
};

// =======================
// ROUTE MANAGEMENT
// =======================

export const createRoute = async (req, res, next) => {
  try {
    const { name, vehicle, stops, busFee } = req.body;
    const route = await Route.create({ name, vehicle, stops, busFee });
    res.status(201).json({ success: true, data: route });
  } catch (error) {
    next(error);
  }
};

export const getRoutes = async (req, res, next) => {
  try {
    const routes = await Route.find()
      .populate('vehicle', 'registrationNumber capacity')
      .populate('assignedStudents.student', 'fullName admissionNumber');
    res.status(200).json({ success: true, data: routes });
  } catch (error) {
    next(error);
  }
};

// =======================
// VEHICLE ASSIGNMENT
// =======================

// Assign a student to a route using the VehicleAssignment model
export const assignStudentToRoute = async (req, res, next) => {
  try {
    const { routeId } = req.params;
    const { studentId, academicYear, stopId, dropStopId } = req.body;

    const route = await Route.findById(routeId).populate('vehicle');
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });

    // 1. Validate Vehicle Capacity
    if (route.assignedStudents.length >= route.vehicle.capacity) {
      return res.status(400).json({ 
        success: false, 
        message: `Vehicle capacity of ${route.vehicle.capacity} has been reached for this route.` 
      });
    }

    // 2. Validate Stops exist on this route
    const pickupStop = route.stops.find(stop => stop._id.toString() === stopId);
    const dropStop = route.stops.find(stop => stop._id.toString() === dropStopId);
    if (!pickupStop || !dropStop) {
      return res.status(400).json({ success: false, message: 'Invalid pickup or drop stop for this route' });
    }

    // 3. Create the Formal Vehicle Assignment Record
    const assignment = await VehicleAssignment.create({
      student: studentId,
      academicYear,
      vehicle: route.vehicle._id,
      route: routeId,
      pickupStop: pickupStop.stopName,
      dropStop: dropStop.stopName,
      assignedBy: req.user._id
    });

    // 4. Update the route's quick-reference array
    route.assignedStudents.push({ student: studentId, stopId });
    await route.save();

    res.status(200).json({ 
      success: true, 
      message: 'Student assigned to route successfully', 
      data: assignment 
    });
  } catch (error) {
    // Catch duplicate assignment errors (handled by Mongoose compound index)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Student is already assigned to a vehicle for this academic year' });
    }
    next(error);
  }
};