const jwt = require('jsonwebtoken');
const config = require('../config/env');
const userDao = require('../dao/user.dao');

class AuthService {
  generateToken(userId) {
    return jwt.sign({ id: userId }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  }

  async registerUser(data) {
    const existing = await userDao.findUserByEmail(data.email);
    if (existing) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      throw error;
    }

    const user = await userDao.createUser(data);
    const token = this.generateToken(user._id);

    return { user, token };
  }

  async loginUser(email, password) {
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

    const token = this.generateToken(user._id);

    return { user, token };
  }
}

module.exports = new AuthService();
