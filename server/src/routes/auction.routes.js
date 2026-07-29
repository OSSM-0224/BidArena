import { Router } from 'express';
import { createAuction, getAuctions, getAuctionById } from '../controllers/auction.controller.js';
import { createAuctionRules, auctionQueryRules } from '../validators/auction.validator.js';
import validate from '../middlewares/validate.middleware.js';
import authenticate from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authenticate, ...createAuctionRules, validate, createAuction);
router.get('/', ...auctionQueryRules, validate, getAuctions);
router.get('/:id', getAuctionById);

export default router;
