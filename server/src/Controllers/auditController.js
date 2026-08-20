import AuditLog from '../models/AuditLog.js';

// Retrieve paginated audit logs for system monitoring
export const getAuditLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;

    // Optional filtering
    const { module, action, userId } = req.query;
    let query = {};
    if (module) query.module = module;
    if (action) query.action = action;
    if (userId) query.user = userId;

    const logs = await AuditLog.find(query)
      .populate('user', 'username role')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await AuditLog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: logs.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: logs
    });
  } catch (error) {
    next(error);
  }
};