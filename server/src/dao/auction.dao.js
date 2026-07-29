import Auction from "../models/Auction.model.js";

export const createAuction = async (auctionData) => {
  const auction = await Auction.create(auctionData);
  return auction;
};

export const findAuctionById = async (auctionId) => {
  const auction = await Auction.findById(auctionId);
  return auction;
};
export const findAuctionsByStatus = async (status, filters = {}) => {
  const query = { ...filters };
  if (status) {
    query.status = status;
  }
  const auctions = await Auction.find(query);
  return auctions;
};

export const findAuctionsWithPagination = async (
  status,
  skip,
  limit,
  filters = {}
) => {
  const query = { ...filters };

  if (status) {
    query.status = status;
  }

  const auctions = await Auction.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalAuctions = await Auction.countDocuments(query);

  return {
    auctions,
    totalAuctions,
  };
};

export const updateAuctionStatus = async (auctionId, status) => {
  const updatedAuction = await Auction.findByIdAndUpdate(
    auctionId,
    { status },
    { new: true }
  );

  return updatedAuction;
};

export const updateHighestBid = async (
  auctionId,
  bidAmount,
  bidderId
) => {
  const updatedAuction = await Auction.findByIdAndUpdate(
    auctionId,
    {
      currentHighestBid: bidAmount,
      highestBidder: bidderId,
    },
    { new: true }
  );

  return updatedAuction;
};

export const incrementBidCount = async (auctionId) => {
  const updatedAuction = await Auction.findByIdAndUpdate(
    auctionId,
    {
      $inc: {
        bidCount: 1,
      },
    },
    { new: true }
  );

  return updatedAuction;
};

export const incrementSpectatorCount = async (auctionId) => {
  const updatedAuction = await Auction.findByIdAndUpdate(
    auctionId,
    { $inc: { spectatorCount: 1 } },
    { new: true }
  );
  return updatedAuction;
};

export const decrementSpectatorCount = async (auctionId) => {
  const updatedAuction = await Auction.findByIdAndUpdate(
    auctionId,
    { $inc: { spectatorCount: -1 } },
    { new: true }
  );
  return updatedAuction;
};

/*
 * Atomic compare-and-swap: only updates currentHighestBid if it still matches
 * the expected value. Used by bidEngine to prevent race conditions between
 * concurrent bid requests.
 */
export const findAuctionByIdAndUpdateIfHighestBid = async (
  id,
  expectedCurrentBid,
  newBidAmount,
  bidderId
) => {
  const updatedAuction = await Auction.findOneAndUpdate(
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
  return updatedAuction;
};

/*
 * Atomically transition auction status — only succeeds if current status
 * is 'active'. Used by timer.service to safely claim the 'completed' state
 * without racing against a concurrent bid processing in bidEngine.
 */
export const findAuctionByIdAndUpdateStatusIfActive = async (id, newStatus) => {
  const updatedAuction = await Auction.findOneAndUpdate(
    { _id: id, status: 'active' },
    { $set: { status: newStatus } },
    { new: true }
  );
  return updatedAuction;
};