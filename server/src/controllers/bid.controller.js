import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import * as bidDao from '../dao/bid.dao.js';

export const getBidsByAuction = asyncHandler(async (req, res) => {
  const { auctionId } = req.params;
  const bids = await bidDao.getBidsByAuction(auctionId);
  ApiResponse.success(res, { bids }, 'Bids fetched successfully');
});
