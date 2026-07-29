import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/env.js';

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, config.accessTokenSecret, {
    expiresIn: config.accessTokenExpiresIn,
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, config.refreshTokenSecret, {
    expiresIn: config.refreshTokenExpiresIn,
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.accessTokenSecret);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.refreshTokenSecret);
};

export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
