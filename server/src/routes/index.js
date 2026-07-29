import { Router } from 'express';
import authRoutes from './auth.routes.js';
import auctionRoutes from './auction.routes.js';
<<<<<<< HEAD
import bidRoutes from './bid.routes.js';
=======
>>>>>>> b4ae1bea3b73fcf49e55d3ce47fbb5fd6a186046

const router = Router();

router.use('/auth', authRoutes);
router.use('/auctions', auctionRoutes);
<<<<<<< HEAD
router.use('/bids', bidRoutes);
=======
>>>>>>> b4ae1bea3b73fcf49e55d3ce47fbb5fd6a186046

export default router;
