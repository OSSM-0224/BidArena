import * as auctionDao from '../dao/auction.dao.js';

class AuctionService {
  async createNewAuction(sellerId, auctionData) {
    const { startingBid, duration } = auctionData;

    if (startingBid <= 0) {
      const error = new Error('Starting bid must be greater than 0');
      error.statusCode = 400;
      throw error;
    }

    if (duration <= 0) {
      const error = new Error('Duration must be at least 1 minute');
      error.statusCode = 400;
      throw error;
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    const auction = await auctionDao.createAuction({
      ...auctionData,
      currentHighestBid: startingBid,
      seller: sellerId,
      startTime,
      endTime,
      status: 'active',
    });

    return auction;
  }

  async getAuctionsByFilter(status, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const { auctions, totalAuctions } = await auctionDao.findAuctionsWithPagination(status, skip, limit);

    const totalPages = Math.ceil(totalAuctions / limit);

    return {
      auctions,
      pagination: {
        page,
        limit,
        total: totalAuctions,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getAuctionDetails(auctionId) {
    const auction = await auctionDao.findAuctionById(auctionId);

    if (!auction) {
      const error = new Error('Auction not found');
      error.statusCode = 404;
      throw error;
    }

    await auction.populate(['seller', 'highestBidder']);

    return auction;
  }

  async validateAuctionOwnership(auctionId, userId) {
    const auction = await auctionDao.findAuctionById(auctionId);

    if (!auction) {
      const error = new Error('Auction not found');
      error.statusCode = 404;
      throw error;
    }

    if (auction.seller.toString() !== userId) {
      const error = new Error('Not authorized to perform this action');
      error.statusCode = 403;
      throw error;
    }

    return auction;
  }
}

export default new AuctionService();
