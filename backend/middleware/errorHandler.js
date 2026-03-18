const AppError = require('../utils/AppError');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle Prisma Unique Constraint Error
  if (err.code === 'P2002') {
    err = new AppError('A record with that field already exists.', 409);
  }

  // Handle Prisma Not Found Error
  if (err.code === 'P2025') {
    err = new AppError('Record not found.', 404);
  }

  res.status(err.statusCode).json({
    error: true,
    message: err.message,
    statusCode: err.statusCode,
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
