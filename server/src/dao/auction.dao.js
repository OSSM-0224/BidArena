import Auction from '../models/Auction.model.js';

export const createAuction = (data) => Auction.create(data);

export const findAuctionById = (id) => Auction.findById(id);

export const findAuctionsByStatus = (status, filters = {}) => {
  const query = { ...filters };
  if (status) query.status = status;
  return Auction.find(query);
};

export const findAuctionsWithPagination = (status, skip, limit, filters = {}) => {
  const query = { ...filters };
  if (status) query.status = status;
  return Promise.all([
    Auction.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Auction.countDocuments(query),
  ]);
};

export const updateAuctionStatus = (id, status) =>
  Auction.findByIdAndUpdate(id, { status }, { new: true });

/*
 * Atomically transition auction status — only succeeds if current status
 * matches the expected value.  Used by timer.service to safely claim the
 * 'completed' state without racing against concurrent bid processing.
 */
export const findAuctionByIdAndUpdateStatusIfActive = (id, newStatus) =>
  Auction.findOneAndUpdate(
    { _id: id, status: 'active' },
    { $set: { status: newStatus } },
    { new: true }
  );

export const updateHighestBid = (id, bidAmount, bidderId) =>
  Auction.findByIdAndUpdate(
    id,
    { currentHighestBid: bidAmount, highestBidder: bidderId },
    { new: true }
  );

export const incrementBidCount = (id) =>
  Auction.findByIdAndUpdate(id, { $inc: { bidCount: 1 } }, { new: true });

export const incrementSpectatorCount = (id) =>
  Auction.findByIdAndUpdate(id, { $inc: { spectatorCount: 1 } }, { new: true });

export const decrementSpectatorCount = (id) =>
  Auction.findByIdAndUpdate(id, { $inc: { spectatorCount: -1 } }, { new: true });

/*
 * Atomic compare-and-swap: only updates currentHighestBid if it still matches
 * the expected value. Used by bidEngine to prevent race conditions.
 */
export const findAuctionByIdAndUpdateIfHighestBid = (id, expectedCurrentBid, newBidAmount, bidderId) =>
  Auction.findOneAndUpdate(
    {
      _id: id,
      currentHighestBid: expectedCurrentBid,
    },
    {
      $set: {
        currentHighestBid: newBidAmount,
        highestBidder: bidderId,
      },
    },
    { new: true }
  );
