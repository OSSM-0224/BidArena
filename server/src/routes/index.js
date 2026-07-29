import { Router } from 'express';
import authRoutes from './auth.routes.js';
import auctionRoutes from './auction.routes.js';
import bidRoutes from './bid.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/auctions', auctionRoutes);
router.use('/bids', bidRoutes);

export default router;
