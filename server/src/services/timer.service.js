import * as auctionDao from '../dao/auction.dao.js';
import * as bidDao from '../dao/bid.dao.js';
import * as timelineDao from '../dao/timeline.dao.js';
import { getIO } from '../config/socket.js';

class TimerService {
  constructor() {
    this._timers = new Map();
  }

  async startAuctionTimer(auctionId) {
    this.clearAuctionTimer(auctionId);

    const auction = await auctionDao.findAuctionById(auctionId);
    if (!auction || auction.status !== 'active') return;

    const now = Date.now();
    const endTime = new Date(auction.endTime).getTime();
    let delay = endTime - now;

    if (delay <= 0) {
      delay = 0;
    }

    const timerRef = setTimeout(() => {
      this.closeAuction(auctionId).catch((err) => {
        console.error(`[Timer] Failed to close auction ${auctionId}:`, err.message);
      });
      this._timers.delete(auctionId);
    }, delay);

    this._timers.set(auctionId, timerRef);
  }

  clearAuctionTimer(auctionId) {
    const existing = this._timers.get(auctionId);
    if (existing) {
      clearTimeout(existing);
      this._timers.delete(auctionId);
    }
  }

  async getRemainingTime(auctionId) {
    const auction = await auctionDao.findAuctionById(auctionId);
    if (!auction) return 0;

    const now = Date.now();
    const endTime = new Date(auction.endTime).getTime();
    const remaining = Math.max(0, endTime - now);

    return Math.floor(remaining / 1000);
  }

  /*
   * Atomically claim the 'completed' status via findOneAndUpdate with
   * a { status: 'active' } filter.  If a concurrent bid changed the
   * auction between our read and this write, the atomic claim fails
   * and we bail — the bidder won the race.
   *
   * Winner is determined from the persisted Bid records (not from the
   * auction's in-memory highestBidder), because the Bid model is the
   * authoritative event-sourced record.
   */
  async closeAuction(auctionId) {
    const claimed = await auctionDao.findAuctionByIdAndUpdateStatusIfActive(auctionId, 'completed');
    if (!claimed) return;

    const highestBid = await bidDao.getHighestBid(auctionId);
    const winner = highestBid ? highestBid.bidder : null;
    const winningBid = highestBid ? highestBid.amount : claimed.currentHighestBid;

    await timelineDao.createTimelineEvent(auctionId, 'completed', {
      winner: winner ? winner.toString() : null,
      winningBid,
      endedAt: new Date(),
    });

    try {
      const io = getIO();
      io.to(auctionId).emit('auction-closed', {
        auctionId,
        status: 'completed',
        winner,
        winningBid,
      });
    } catch {
      // Socket.io not initialised yet
    }

    this._timers.delete(auctionId);
  }

  async initActiveTimers() {
    const activeAuctions = await auctionDao.findAuctionsByStatus('active');
    for (const auction of activeAuctions) {
      await this.startAuctionTimer(auction._id);
    }
    console.log(`[Timer] Started timers for ${activeAuctions.length} active auction(s)`);
  }
}

export default new TimerService();
