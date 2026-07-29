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

export const updateHighestBid = (id, bidAmount, bidderId) =>
  Auction.findByIdAndUpdate(
    id,
    { currentHighestBid: bidAmount, highestBidder: bidderId },
    { new: true }
  );

export const incrementBidCount = (id) =>
  Auction.findByIdAndUpdate(id, { $inc: { bidCount: 1 } }, { new: true });
