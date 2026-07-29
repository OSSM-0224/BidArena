import User from '../models/User.model.js';

export const createUser = (data) => User.create(data);

export const findUserByEmail = (email) => User.findOne({ email });

export const findUserByEmailWithPassword = (email) => User.findOne({ email }).select('+password');

export const findUserById = (id) => User.findById(id);

export const findUserByIdWithRefreshTokens = (id) =>
  User.findById(id).select('+refreshTokens');

export const updateUser = (id, data) =>
  User.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const pushRefreshToken = (userId, hashedToken, device = 'unknown') =>
  User.findByIdAndUpdate(
    userId,
    { $push: { refreshTokens: { token: hashedToken, device } } },
    { new: true }
  );

export const pullRefreshToken = (userId, hashedToken) =>
  User.findByIdAndUpdate(
    userId,
    { $pull: { refreshTokens: { token: hashedToken } } },
    { new: true }
  );

export const clearAllRefreshTokens = (userId) =>
  User.findByIdAndUpdate(
    userId,
    { $set: { refreshTokens: [] } },
    { new: true }
  );

export const findUserByRefreshToken = (hashedToken) =>
  User.findOne({ 'refreshTokens.token': hashedToken });
