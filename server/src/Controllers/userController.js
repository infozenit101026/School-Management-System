import User from '../models/User.js';

export const getAllUsers = async (req, res, next) => {
  try {
    // Exclude passwords from the result[cite: 17]
    const users = await User.find().select('-password').sort({ role: 1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isActive = !user.isActive; // Toggle between true/false[cite: 17]
    await user.save();

    res.status(200).json({ success: true, message: `User status changed to ${user.isActive}`, data: user });
  } catch (error) {
    next(error);
  }
};