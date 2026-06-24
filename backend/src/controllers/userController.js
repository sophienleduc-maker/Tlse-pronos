import User from '../models/User.js';
import Prono from '../models/Prono.js';
import Transaction from '../models/Transaction.js';
import Bankroll from '../models/Bankroll.js';

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    const { notifications, emailUpdates, darkMode } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        preferences: {
          notifications,
          emailUpdates,
          darkMode
        }
      },
      { new: true }
    );
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const bankroll = await Bankroll.findOne({ userId: req.params.id });
    
    const stats = {
      totalPronoBought: user.pronoBought.length,
      bankroll: user.bankroll,
      bankrollData: bankroll
    };
    
    res.status(200).json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    // Implementation would include file upload handling
    res.status(200).json({ success: true, message: 'Avatar uploaded' });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Bankroll.deleteOne({ userId: req.params.id });
    await Transaction.deleteMany({ userId: req.params.id });
    
    res.status(200).json({ success: true, message: 'Account deleted' });
  } catch (error) {
    next(error);
  }
};
