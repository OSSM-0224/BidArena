import config from '../config/env.js';

export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000,
};

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: 'strict',
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const clearAccessTokenCookie = {
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: 'strict',
  maxAge: 0,
};

export const clearRefreshTokenCookie = {
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: 'strict',
  path: '/api/auth',
  maxAge: 0,
};
