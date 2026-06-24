import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    user = await User.create({
      email,
      password,
      firstName,
      lastName
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      }
      await user.save();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Reset login attempts
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bankroll: user.bankroll
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const token = generateToken(user._id);
    res.status(200).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30m'
    });

    // Send email (implementation depends on your email service)
    // sendResetEmail(user.email, resetToken);

    res.status(200).json({ success: true, message: 'Reset email sent' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.password = password;
      await user.save();

      res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    next(error);
  }
};
