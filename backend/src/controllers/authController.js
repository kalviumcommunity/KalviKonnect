const authService = require('../services/authService');
const userSerializer = require('../utils/userSerializer');

exports.register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    const { token, ...userData } = user;
    res.status(201).json({
      error: false,
      data: { ...userSerializer(userData), token },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await authService.login(req.body.email, req.body.password);
    const { token, ...userData } = user;
    res.status(200).json({
      error: false,
      data: { ...userSerializer(userData), token },
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      error: false,
      data: userSerializer(req.user),
    });
  } catch (err) {
    next(err);
  }
};
