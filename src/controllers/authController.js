// controllers/authController.js
const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('register error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('login error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};
