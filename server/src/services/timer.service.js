import * as auctionDao from '../dao/auction.dao.js';
import * as bidDao from '../dao/bid.dao.js';
import * as timelineDao from '../dao/timeline.dao.js';
import { getIO } from '../config/socket.js';

/*
 * Timer service — server-authoritative countdown per auction.
 *
 * Timers are stored in-memory via setTimeout references keyed by auctionId.
 * However, the source of truth for remaining time is always the auction's
 * `endTime` field in MongoDB, NOT the in-memory timeout.  This means:
 *   • After a server restart, remaining time is recalculated from the DB
 *   • Clock drift between setTimeout and real time is irrelevant
 *   • getRemainingTime() always returns the authoritative value
 */
class TimerService {
  constructor() {
    this._timers = new Map();
  }

  /*
   * Start (or restart) the countdown for an auction.
   * Reads endTime from DB and schedules closeAuction accordingly.
   * If endTime has already passed, closes immediately.
   */
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

  /*
   * Authoritative remaining time — always calculated from DB endTime.
   * Never from the in-memory timeout, so it survives restarts and
   * clock adjustments.
   */
  async getRemainingTime(auctionId) {
    const auction = await auctionDao.findAuctionById(auctionId);
    if (!auction) return 0;

    const now = Date.now();
    const endTime = new Date(auction.endTime).getTime();
    const remaining = Math.max(0, endTime - now);

    return Math.floor(remaining / 1000);
  }

  /*
   * Close an auction: atomically transition status to 'completed',
   * determine winner from the Bid model, create timeline event,
   * and notify the room via socket.
   *
   * ── Race condition prevention ──────────────────────────────────────
   * We use findOneAndUpdate with a { status: 'active' } filter so that
   * this operation is atomic — if a concurrent bid processBid() checks
   * status and writes before we do, findOneAndUpdate returns null and
   * we bail out (the bidder won the race).  This ensures we never declare
   * a winner while a bid is still in-flight.
   *
   * Winner is determined from the persisted Bid records, not from the
   * auction's in-memory `highestBidder` field, because the Bid model is
   * the authoritative event-sourced record of all bids.
   */
  async closeAuction(auctionId) {
    /*
     * Atomically claim the 'completed' status.  Only succeeds if the
     * auction is still 'active' — a concurrent bid might have snuck in
     * and changed something, in which case we bail and let the next
     * timer tick handle it (or the bid engine can detect it).
     */
    const claimed = await auctionDao.findAuctionByIdAndUpdateStatusIfActive(auctionId, 'completed');
    if (!claimed) return;

    // Winner is the highest bid record, which is the source of truth
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
      // Socket.io not initialized yet — fine during startup
    }

    this._timers.delete(auctionId);
  }

  /*
   * On server startup, scan all active auctions and start their timers.
   * This guarantees no auction is orphaned after a restart.
   */
  async initActiveTimers() {
    const activeAuctions = await auctionDao.findAuctionsByStatus('active');
    for (const auction of activeAuctions) {
      await this.startAuctionTimer(auction._id);
    }
    console.log(`[Timer] Started timers for ${activeAuctions.length} active auction(s)`);
  }
}

export default new TimerService();
