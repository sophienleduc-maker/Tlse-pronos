import Bankroll from '../models/Bankroll.js';
import Transaction from '../models/Transaction.js';

export const getUserBankroll = async (req, res, next) => {
  try {
    let bankroll = await Bankroll.findOne({ userId: req.user.id });

    if (!bankroll) {
      bankroll = await Bankroll.create({
        userId: req.user.id,
        initialBankroll: 0,
        currentBankroll: 0
      });
    }

    res.status(200).json({ success: true, bankroll });
  } catch (error) {
    next(error);
  }
};

export const getBankrollStats = async (req, res, next) => {
  try {
    const bankroll = await Bankroll.findOne({ userId: req.user.id });

    if (!bankroll) {
      return res.status(404).json({ error: 'Bankroll not found' });
    }

    const stats = {
      totalBets: bankroll.totalBets,
      totalWins: bankroll.totalWins,
      totalLosses: bankroll.totalLosses,
      winRate: bankroll.winRate,
      roi: bankroll.roi,
      totalWinAmount: bankroll.totalWinAmount,
      totalLossAmount: bankroll.totalLossAmount,
      currentBankroll: bankroll.currentBankroll,
      profit: bankroll.currentBankroll - bankroll.initialBankroll
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

export const getBankrollHistory = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, count: transactions.length, transactions });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyStats = async (req, res, next) => {
  try {
    const bankroll = await Bankroll.findOne({ userId: req.user.id });

    if (!bankroll) {
      return res.status(404).json({ error: 'Bankroll not found' });
    }

    res.status(200).json({ success: true, monthlyStats: bankroll.monthlyStats });
  } catch (error) {
    next(error);
  }
};

export const getPerformanceMetrics = async (req, res, next) => {
  try {
    const bankroll = await Bankroll.findOne({ userId: req.user.id });

    if (!bankroll) {
      return res.status(404).json({ error: 'Bankroll not found' });
    }

    const metrics = {
      bestStreak: bankroll.bestStreak,
      worstStreak: bankroll.worstStreak,
      averageOdds: bankroll.averageOdds,
      roi: bankroll.roi,
      winRate: bankroll.winRate
    };

    res.status(200).json({ success: true, metrics });
  } catch (error) {
    next(error);
  }
};
