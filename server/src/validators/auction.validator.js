import { body, query } from 'express-validator';

export const createAuctionRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
  body('startingBid')
    .notEmpty().withMessage('Starting bid is required')
    .isFloat({ gt: 0 }).withMessage('Starting bid must be a positive number'),
  body('duration')
    .notEmpty().withMessage('Duration is required')
    .isInt({ gt: 0 }).withMessage('Duration must be a positive number in minutes'),
  body('imageUrl')
    .optional()
    .trim()
    .isURL().withMessage('Image URL must be a valid URL'),
  body('minIncrement')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Minimum increment must be a positive number'),
];

export const auctionQueryRules = [
  query('status')
    .optional()
    .isIn(['upcoming', 'active', 'completed']).withMessage('Status must be one of: upcoming, active, completed'),
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];
