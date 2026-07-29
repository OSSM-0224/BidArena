import Bid from '../models/Bid.model.js';

export const createBid = (data) => Bid.create(data);

export const getBidsByAuction = (auctionId) =>
  Bid.find({ auction: auctionId }).sort({ amount: -1 }).populate('bidder', 'name email');

export const getHighestBid = (auctionId) =>
  Bid.findOne({ auction: auctionId }).sort({ amount: -1 });

export const markPreviousBidsAsNotWinning = (auctionId, excludeBidderId) =>
  Bid.updateMany(
    { auction: auctionId, bidder: { $ne: excludeBidderId } },
    { $set: { isWinning: false } }
  );
