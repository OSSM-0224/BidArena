import ApiResponse from '../utils/apiResponse.js';
import config from '../config/env.js';

const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    const fields = Object.keys(err.errors);
    message = fields.map((f) => err.errors[f].message).join(', ');
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (config.nodeEnv === 'development') {
    console.error('ERROR:', err);
  }

  ApiResponse.error(res, message, statusCode, errors);
};

export default errorHandler;
