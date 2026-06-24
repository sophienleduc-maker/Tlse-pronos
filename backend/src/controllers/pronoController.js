import Prono from '../models/Prono.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getAllPronos = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sport, status } = req.query;

    const query = {};
    if (sport) query.sport = sport;
    if (status) query.status = status;

    const pronos = await Prono.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Prono.countDocuments(query);

    res.status(200).json({
      success: true,
      count: pronos.length,
      total,
      pages: Math.ceil(total / limit),
      pronos
    });
  } catch (error) {
    next(error);
  }
};

export const getPronoById = async (req, res, next) => {
  try {
    const prono = await Prono.findById(req.params.id);

    if (!prono) {
      return res.status(404).json({ error: 'Prono not found' });
    }

    res.status(200).json({ success: true, prono });
  } catch (error) {
    next(error);
  }
};

export const searchPronos = async (req, res, next) => {
  try {
    const { q } = req.query;

    const pronos = await Prono.find({
      $or: [
        { event: { $regex: q, $options: 'i' } },
        { competition: { $regex: q, $options: 'i' } },
        { teams: { $in: [new RegExp(q, 'i')] } }
      ]
    });

    res.status(200).json({ success: true, count: pronos.length, pronos });
  } catch (error) {
    next(error);
  }
};

export const filterPronos = async (req, res, next) => {
  try {
    const { sport, confidence, minOdds, maxOdds, status } = req.query;

    const query = {};
    if (sport) query.sport = sport;
    if (confidence) query.confidence = confidence;
    if (minOdds || maxOdds) {
      query.odds = {};
      if (minOdds) query.odds.$gte = minOdds;
      if (maxOdds) query.odds.$lte = maxOdds;
    }
    if (status) query.status = status;

    const pronos = await Prono.find(query).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: pronos.length, pronos });
  } catch (error) {
    next(error);
  }
};

export const buyProno = async (req, res, next) => {
  try {
    const prono = await Prono.findById(req.params.id);
    if (!prono) {
      return res.status(404).json({ error: 'Prono not found' });
    }

    const user = await User.findById(req.user.id);

    // Check if user already bought this prono
    if (user.pronoBought.includes(prono._id)) {
      return res.status(400).json({ error: 'You already bought this prono' });
    }

    // Process payment with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(prono.stake * 100), // Convert to cents
      currency: 'eur',
      metadata: {
        pronoId: prono._id.toString(),
        userId: user._id.toString()
      }
    });

    // Create transaction
    const transaction = await Transaction.create({
      userId: user._id,
      pronoId: prono._id,
      type: 'purchase',
      amount: prono.stake,
      currency: 'EUR',
      stripeTransactionId: paymentIntent.id,
      status: 'pending'
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      transactionId: transaction._id
    });
  } catch (error) {
    next(error);
  }
};

export const getUserPronoHistory = async (req, res, next) => {
  try {
    const pronos = await Prono.find({ _id: { $in: req.user.pronoBought } });

    res.status(200).json({ success: true, count: pronos.length, pronos });
  } catch (error) {
    next(error);
  }
};

export const rateProno = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const prono = await Prono.findById(req.params.id);
    if (!prono) {
      return res.status(404).json({ error: 'Prono not found' });
    }

    // Check if user bought this prono
    const user = await User.findById(req.user.id);
    if (!user.pronoBought.includes(prono._id)) {
      return res.status(403).json({ error: 'You must buy this prono to rate it' });
    }

    prono.ratings.average = ((prono.ratings.average * prono.ratings.count) + rating) / (prono.ratings.count + 1);
    prono.ratings.count += 1;

    await prono.save();

    res.status(200).json({ success: true, prono });
  } catch (error) {
    next(error);
  }
};
