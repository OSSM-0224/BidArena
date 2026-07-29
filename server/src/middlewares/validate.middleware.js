import { validationResult } from 'express-validator';
import ApiResponse from '../utils/apiResponse.js';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return ApiResponse.error(res, 'Validation failed', 400, formatted);
  }
  next();
};

export default validate;
