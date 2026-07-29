import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import auctionService from '../services/auction.service.js';

export const createAuction = asyncHandler(async (req, res) => {
  const auction = await auctionService.createNewAuction(req.user._id, req.body);
  ApiResponse.success(res, { auction }, 'Auction created successfully', 201);
});

export const getAuctions = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query;
  const result = await auctionService.getAuctionsByFilter(status, page, limit);
  ApiResponse.success(res, result, 'Auctions fetched successfully');
});

export const getAuctionById = asyncHandler(async (req, res) => {
  const auction = await auctionService.getAuctionDetails(req.params.id);
  ApiResponse.success(res, { auction }, 'Auction fetched successfully');
});
