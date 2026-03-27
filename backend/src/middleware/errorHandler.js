const AppError = require('../utils/AppError');

module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  if (err.code === 'P2002') {
    error = new AppError('Already upvoted or bookmarked', 409); // Note: Prompt said "A record with that field already exists" or "Already done", but we will use the specific error from Prisma if needed. But to be safe, we let AppError set the code to 409.
  }

  if (err.code === 'P2025') {
    error = new AppError('Not found', 404);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired, please log in again', 401);
  }
  
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401);
  }

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Something went wrong';

  res.status(statusCode).json({
    error: true,
    message: message,
    statusCode: statusCode
  });
};
