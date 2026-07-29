const jwt = require('jsonwebtoken');
const config = require('../config/env');
const userDao = require('../dao/user.dao');
const ApiResponse = require('../utils/apiResponse');

const authenticate = async (req, res, next) => {
  try {
    let token;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return ApiResponse.error(res, 'Not authorized, no token provided', 401);
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await userDao.findUserById(decoded.id);
    if (!user) {
      return ApiResponse.error(res, 'User belonging to this token no longer exists', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return ApiResponse.error(res, 'Not authorized, invalid token', 401);
    }
    next(err);
  }
};

module.exports = authenticate;
