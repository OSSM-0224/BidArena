const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const authService = require('../services/auth.service');
const config = require('../config/env');

const cookieOptions = {
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, token } = await authService.registerUser({ name, email, password });

  res.cookie('token', token, cookieOptions);

  ApiResponse.success(res, { user, token }, 'Registration successful', 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser(email, password);

  res.cookie('token', token, cookieOptions);

  ApiResponse.success(res, { user, token }, 'Login successful');
});

const logout = asyncHandler(async (_req, res) => {
  res.cookie('token', 'none', {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000),
  });

  ApiResponse.success(res, null, 'Logged out successfully');
});

const getMe = asyncHandler(async (req, res) => {
  ApiResponse.success(res, { user: req.user }, 'User profile fetched');
});

module.exports = { register, login, logout, getMe };
