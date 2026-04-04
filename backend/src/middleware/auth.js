const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const auth = (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Authentication required', 401));
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach decoded payload to req.user
      req.user = {
        userId: decoded.userId,
        role: decoded.role,
        email: decoded.email
      };
      
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new AppError('Token expired, please log in again', 401));
      }
      return next(new AppError('Invalid token', 401));
    }
  } catch (err) {
    next(err);
  }
};

auth.protect = auth;
module.exports = auth;
