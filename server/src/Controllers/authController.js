import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign({ id: userId, role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION,
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION,
  });
  return { accessToken, refreshToken };
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user & explicitly select password for verification
    const user = await User.findOne({ email, isActive: true }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or inactive account', errorCode: 'UNAUTHORIZED' });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials', errorCode: 'UNAUTHORIZED' });
    }

    // 3. Generate Tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // 4. Return Standard API Response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: { id: user._id, username: user.username, role: user.role },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errorCode: 'SERVER_ERROR' });
  }
};