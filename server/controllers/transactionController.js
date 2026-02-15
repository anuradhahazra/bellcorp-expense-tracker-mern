const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const search = (req.query.search || '').trim();
    const category = (req.query.category || '').trim();
    const sortBy = req.query.sortBy || 'date';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const filter = { userId: req.user._id };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) {
      filter.category = category;
    }
    if (req.query.dateFrom) {
      filter.date = filter.date || {};
      filter.date.$gte = new Date(req.query.dateFrom);
    }
    if (req.query.dateTo) {
      filter.date = filter.date || {};
      filter.date.$lte = new Date(req.query.dateTo);
    }
    if (req.query.amountMin !== undefined && req.query.amountMin !== '') {
      filter.amount = filter.amount || {};
      filter.amount.$gte = Number(req.query.amountMin);
    }
    if (req.query.amountMax !== undefined && req.query.amountMax !== '') {
      filter.amount = filter.amount || {};
      filter.amount.$lte = Number(req.query.amountMax);
    }

    const sort = { [sortBy]: sortOrder };

    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Transaction.countDocuments(filter),
    ]);

    res.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (err) {
    next(err);
  }
};

exports.createTransaction = async (req, res, next) => {
  try {
    const { title, amount, category, date, notes } = req.body;
    if (!title || amount === undefined || !category) {
      return res.status(400).json({ message: 'Title, amount and category are required' });
    }
    const transaction = await Transaction.create({
      title,
      amount: Number(amount),
      category,
      date: date ? new Date(date) : new Date(),
      notes: notes || '',
      userId: req.user._id,
    });
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    const { title, amount, category, date, notes } = req.body;
    if (title !== undefined) transaction.title = title;
    if (amount !== undefined) transaction.amount = Number(amount);
    if (category !== undefined) transaction.category = category;
    if (date !== undefined) transaction.date = new Date(date);
    if (notes !== undefined) transaction.notes = notes;
    await transaction.save();
    res.json(transaction);
  } catch (err) {
    next(err);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    next(err);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalExpense, categorySummary, recentTransactions] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]).then((r) => (r[0] ? r[0].total : 0)),
      Transaction.aggregate([
        { $match: { userId } },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
        { $limit: 10 },
      ]),
      Transaction.find({ userId }).sort({ date: -1 }).limit(5).lean(),
    ]);

    res.json({
      totalExpense,
      categorySummary: categorySummary.map((c) => ({
        category: c._id,
        total: c.total,
        count: c.count,
      })),
      recentTransactions,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Transaction.distinct('category', { userId: req.user._id });
    res.json(categories.sort());
  } catch (err) {
    next(err);
  }
};
