import SchoolSettings from '../models/SchoolSettings.js';
import { logAction } from '../services/auditService.js';

// Get current system settings
export const getSettings = async (req, res, next) => {
  try {
    // Populating 'currentAcademicYear' based on your specific schema[cite: 41]
    let settings = await SchoolSettings.findOne().populate('currentAcademicYear', 'year');
    
    // Auto-initialize with schema defaults if no settings exist in DB yet[cite: 41]
    if (!settings) {
      settings = await SchoolSettings.create({
        schoolName: 'My School',
        attendanceClosingTime: '12:00'
      });
    }

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// Update system settings (Admin / School Manager)
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await SchoolSettings.findOne();

    if (!settings) {
      settings = new SchoolSettings(req.body);
    } else {
      Object.assign(settings, req.body); // Updates schoolName, attendanceClosingTime, or currentAcademicYear[cite: 41]
    }

    const updatedSettings = await settings.save();

    // Audit Log entry using your existing service
    await logAction({
      user: req.user._id,
      action: 'UPDATE',
      module: 'SETTINGS',
      recordId: updatedSettings._id,
      newValue: req.body,
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'School settings updated successfully',
      data: updatedSettings
    });
  } catch (error) {
    next(error);
  }
};