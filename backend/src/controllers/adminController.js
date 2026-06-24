import Prono from '../models/Prono.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Bankroll from '../models/Bankroll.js';

export const createProno = async (req, res, next) => {
  try {
    const prono = await Prono.create(req.body);
    res.status(201).json({ success: true, prono });
  } catch (error) {
    next(error);
  }
};

export const updateProno = async (req, res, next) => {
  try {
    const prono = await Prono.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, prono });
  } catch (error) {
    next(error);
  }
};

export const setPronoResult = async (req, res, next) => {
  try {
    const { status, result } = req.body;
    const prono = await Prono.findByIdAndUpdate(
      req.params.id,
      { status, result, resultDate: new Date() },
      { new: true }
    );

    // If prono is lost and refund is enabled, trigger refunds
    if (status === 'lost' && process.env.ADMIN_PRONO_REFUND_ENABLED === 'true') {
      await processRefundsForProno(prono);
    }

    res.status(200).json({ success: true, prono });
  } catch (error) {
    next(error);
  }
};

export const deleteProno = async (req, res, next) => {
  try {
    await Prono.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Prono deleted' });
  } catch (error) {
    next(error);
  }
};

const processRefundsForProno = async (prono) => {
  try {
    // Get all users who bought this prono
    const users = await User.find({ pronoBought: prono._id });

    for (const user of users) {
      // Check if refund already processed
      const existingRefund = await Transaction.findOne({
        pronoId: prono._id,
        userId: user._id,
        type: 'refund',
        status: 'completed'
      });

      if (!existingRefund) {
        // Create refund transaction
        await Transaction.create({
          userId: user._id,
          pronoId: prono._id,
          type: 'refund',
          amount: prono.refundAmount,
          currency: 'EUR',
          status: 'completed',
          description: `Remboursement automatique - Pronostic perdant: ${prono.event}`,
          refundReason: 'Prono declared as lost'
        });

        // Update user's bankroll
        await User.findByIdAndUpdate(user._id, {
          $inc: { 'bankroll.totalProfit': prono.refundAmount }
        });
      }
    }

    prono.refundProcessed = true;
    prono.refundProcessedDate = new Date();
    await prono.save();
  } catch (error) {
    console.error('Error processing refunds:', error);
  }
};

export const processRefund = async (req, res, next) => {
  try {
    const prono = await Prono.findById(req.params.pronoId);
    if (!prono) {
      return res.status(404).json({ error: 'Prono not found' });
    }

    await processRefundsForProno(prono);

    res.status(200).json({ success: true, message: 'Refunds processed' });
  } catch (error) {
    next(error);
  }
};

export const getRefunds = async (req, res, next) => {
  try {
    const refunds = await Transaction.find({ type: 'refund' })
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ success: true, count: refunds.length, refunds });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const users = await User.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / limit),
      users
    });
  } catch (error) {
    next(error);
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const bankroll = await Bankroll.findOne({ userId: req.params.id });
    const transactions = await Transaction.find({ userId: req.params.id })
      .limit(50)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
      bankroll,
      recentTransactions: transactions
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const getOverviewStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPronos = await Prono.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    const totalRevenue = await Transaction.aggregate([
      { $match: { type: 'purchase', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const stats = {
      totalUsers,
      totalPronos,
      totalTransactions,
      totalRevenue: totalRevenue[0]?.total || 0
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

export const getRevenueStats = async (req, res, next) => {
  try {
    const revenueByMonth = await Transaction.aggregate([
      { $match: { type: 'purchase', status: 'completed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    res.status(200).json({ success: true, revenueByMonth });
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (req, res, next) => {
  try {
    const usersByStatus = await User.aggregate([
      {
        $group: {
          _id: '$isActive',
          count: { $sum: 1 }
        }
      }
    ]);

    const topUsers = await User.find()
      .sort({ 'bankroll.totalProfit': -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      usersByStatus,
      topUsers
    });
  } catch (error) {
    next(error);
  }
};
