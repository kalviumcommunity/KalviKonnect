const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({
      error: false,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await authService.login(req.body.email, req.body.password);
    res.status(200).json({
      error: false,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const { password, ...userSafe } = req.user;
    res.status(200).json({
      error: false,
      data: userSafe,
    });
  } catch (err) {
    next(err);
  }
};
