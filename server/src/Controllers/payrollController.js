import Payroll from '../models/Payroll.js';
import SalaryStructure from '../models/SalaryStructure.js'; // Added import

// Create or Update a Staff's base Salary Structure
export const upsertSalaryStructure = async (req, res, next) => {
  try {
    const { staffId, basicSalary, allowances, deductions, salaryType, hourlyWage } = req.body;

    const structure = await SalaryStructure.findOneAndUpdate(
      { staff: staffId },
      { basicSalary, allowances, deductions, salaryType, hourlyWage, updatedBy: req.user._id },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: structure });
  } catch (error) {
    next(error);
  }
};

// Generate monthly payroll dynamically using the Salary Structure
export const generatePayroll = async (req, res, next) => {
  try {
    const { staffId, month, year, bonus = 0, overtime = 0, advance = 0 } = req.body;
    
    // Fetch base pay structure
    const structure = await SalaryStructure.findOne({ staff: staffId });
    if (!structure) {
      return res.status(404).json({ success: false, message: 'Salary structure not found for this staff member.' });
    }

    // Calculate dynamic Net Salary
    const netSalary = (structure.basicSalary + structure.allowances + bonus + overtime) - (structure.deductions + advance);

    // Generate the payroll receipt
    const payroll = await Payroll.create({
      staff: staffId,
      month,
      year,
      basicSalary: structure.basicSalary,
      allowances: structure.allowances,
      bonus,
      overtime,
      deductions: structure.deductions,
      advance,
      netSalary,
      processedBy: req.user._id
    });

    res.status(201).json({ success: true, data: payroll });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Payroll for this month and year has already been generated.' });
    }
    next(error);
  }
};

// Retrieve a staff member's payroll history
export const getPayrollHistory = async (req, res, next) => {
  try {
    const { staffId } = req.params;
    const payrolls = await Payroll.find({ staff: staffId })
      .populate('processedBy', 'username')
      .sort({ year: -1, month: -1 });

    res.status(200).json({ success: true, data: payrolls });
  } catch (error) {
    next(error);
  }
};

// Update payroll status to PAID
export const markPayrollAsPaid = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const payroll = await Payroll.findByIdAndUpdate(
      id, 
      { paymentStatus: 'PAID', paymentDate: new Date() }, 
      { new: true, runValidators: true }
    );

    if (!payroll) {
      return res.status(404).json({ success: false, message: 'Payroll record not found' });
    }

    res.status(200).json({ success: true, message: 'Payroll marked as paid', data: payroll });
  } catch (error) {
    next(error);
  }
};