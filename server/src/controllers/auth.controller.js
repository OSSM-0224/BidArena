import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import authService from '../services/auth.service.js';
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  clearAccessTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/cookieHelper.js';

export const register = asyncHandler(async (req, res) => {
  const device = req.headers['user-agent'] || 'unknown';
  const { user, accessToken, refreshToken } = await authService.registerUser(req.body, device);

  res.cookie('accessToken', accessToken, accessTokenCookieOptions);
  res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

  ApiResponse.success(res, { user, accessToken }, 'Registration successful', 201);
});

export const login = asyncHandler(async (req, res) => {
  const device = req.headers['user-agent'] || 'unknown';
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser(email, password, device);

  res.cookie('accessToken', accessToken, accessTokenCookieOptions);
  res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

  ApiResponse.success(res, { user, accessToken }, 'Login successful');
});

export const refresh = asyncHandler(async (req, res) => {
  const oldRefreshToken = req.cookies?.refreshToken;

  if (!oldRefreshToken) {
    return ApiResponse.error(res, 'No refresh token provided', 401);
  }

  const device = req.headers['user-agent'] || 'unknown';
  const { user, accessToken, refreshToken } = await authService.refreshAccessToken(oldRefreshToken, device);

  res.cookie('accessToken', accessToken, accessTokenCookieOptions);
  res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

  ApiResponse.success(res, { user, accessToken }, 'Token refreshed successfully');
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  const userId = req.user?._id;

  if (userId && refreshToken) {
    await authService.logoutUser(userId, refreshToken);
  }

  res.cookie('accessToken', '', clearAccessTokenCookie);
  res.cookie('refreshToken', '', clearRefreshTokenCookie);

  ApiResponse.success(res, null, 'Logged out successfully');
});

export const logoutAll = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await authService.logoutAllSessions(userId);

  res.cookie('accessToken', '', clearAccessTokenCookie);
  res.cookie('refreshToken', '', clearRefreshTokenCookie);

  ApiResponse.success(res, null, 'Logged out from all devices successfully');
});

export const getMe = asyncHandler(async (req, res) => {
  ApiResponse.success(res, { user: req.user }, 'User profile fetched');
});
