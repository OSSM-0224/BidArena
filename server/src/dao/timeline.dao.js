import Timeline from '../models/Timeline.model.js';

export const createTimelineEvent = (auctionId, eventType, metadata = {}) =>
  Timeline.create({ auction: auctionId, eventType, metadata });

export const getTimelineByAuction = (auctionId) =>
  Timeline.find({ auction: auctionId }).sort({ createdAt: 1 });
