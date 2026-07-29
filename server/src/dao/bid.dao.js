import Bid from '../models/Bid.model.js';

export const createBid = (data) => Bid.create(data);

export const getBidsByAuction = (auctionId) =>
  Bid.find({ auction: auctionId }).sort({ amount: -1 }).populate('bidder', 'name email');

export const getHighestBid = (auctionId) =>
  Bid.findOne({ auction: auctionId }).sort({ amount: -1 });

/*
 * Mark all previous bids for this auction as no longer winning.
 * This ensures only the current highest bidder is marked as winning.
 * Run asynchronously — not on the critical bid-acceptance path.
 */
export const markPreviousBidsAsNotWinning = (auctionId, excludeBidderId) =>
  Bid.updateMany(
    { auction: auctionId, bidder: { $ne: excludeBidderId } },
    { $set: { isWinning: false } }
  );
