import * as userDao from '../dao/user.dao.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} from '../utils/jwtHelper.js';

class AuthService {
  async registerUser(data, device = 'unknown') {
    const existing = await userDao.findUserByEmail(data.email);
    if (existing) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      throw error;
    }

    const user = await userDao.createUser(data);
    const { accessToken, refreshToken } = await this._generateTokenPair(user._id, device);

    return { user, accessToken, refreshToken };
  }

  async loginUser(email, password, device = 'unknown') {
    const user = await userDao.findUserByEmailWithPassword(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const { accessToken, refreshToken } = await this._generateTokenPair(user._id, device);

    return { user, accessToken, refreshToken };
  }

  async refreshAccessToken(oldRefreshToken, device = 'unknown') {
    let decoded;
    try {
      decoded = verifyRefreshToken(oldRefreshToken);
    } catch {
      const error = new Error('Invalid or expired refresh token');
      error.statusCode = 401;
      throw error;
    }

    const hashedOldToken = hashToken(oldRefreshToken);
    const user = await userDao.findUserByIdWithRefreshTokens(decoded.id);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const storedToken = user.refreshTokens.find((rt) => rt.token === hashedOldToken);

    if (!storedToken) {
      // Possible token reuse attack — revoke all tokens for this user
      await userDao.clearAllRefreshTokens(user._id);
      const error = new Error('Refresh token has been revoked. Please log in again.');
      error.statusCode = 401;
      throw error;
    }

    // Remove old refresh token
    await userDao.pullRefreshToken(user._id, hashedOldToken);

    // Generate new pair
    const { accessToken, refreshToken } = await this._generateTokenPair(user._id, device);

    return { user, accessToken, refreshToken };
  }

  async logoutUser(userId, refreshToken) {
    if (!refreshToken) return;

    const hashedToken = hashToken(refreshToken);
    await userDao.pullRefreshToken(userId, hashedToken);
  }

  async logoutAllSessions(userId) {
    await userDao.clearAllRefreshTokens(userId);
  }

  async _generateTokenPair(userId, device) {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    const hashedRefresh = hashToken(refreshToken);

    await userDao.pushRefreshToken(userId, hashedRefresh, device);

    return { accessToken, refreshToken };
  }
}

export default new AuthService();
