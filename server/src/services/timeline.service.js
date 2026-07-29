import * as timelineDao from '../dao/timeline.dao.js';

class TimelineService {
  async addEvent(auctionId, eventType, metadata = {}) {
    return timelineDao.createTimelineEvent(auctionId, eventType, metadata);
  }

  async getTimeline(auctionId) {
    return timelineDao.getTimelineByAuction(auctionId);
  }
}

export default new TimelineService();
