import { Router } from 'express';
import { getBidsByAuction } from '../controllers/bid.controller.js';

const router = Router();

router.get('/:auctionId', getBidsByAuction);

export default router;
