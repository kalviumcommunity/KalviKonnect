const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const prisma = require('../db');

module.exports = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Authentication required', 401));
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new AppError('Token expired, please log in again', 401));
      }
      return next(new AppError('Invalid token', 401));
    }

    // Check if user still exists
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists', 401));
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
