import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { findUserById } from '../dao/user.dao.js';
import ApiResponse from '../utils/apiResponse.js';

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

    const user = await findUserById(decoded.id);
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

export default authenticate;
