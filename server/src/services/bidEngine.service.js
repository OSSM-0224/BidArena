import * as auctionDao from '../dao/auction.dao.js';
import * as bidDao from '../dao/bid.dao.js';
import * as timelineDao from '../dao/timeline.dao.js';

class BidEngineService {
  /*
   * processBid — core bidding logic with atomic concurrency control.
   *
   * ── Concurrency strategy: Atomic Compare-and-Swap ────────────────
   *
   * We use MongoDB's findOneAndUpdate with a conditional filter that
   * includes the expected currentHighestBid.  The operation atomically
   * matches-and-updates in a single round-trip:
   *
   *   { _id, currentHighestBid: <expected> }
   *   → { $set: { currentHighestBid: <new>, highestBidder: <user> } }
   *
   * If another request changed currentHighestBid between our read and
   * this write, the filter matches zero documents, findOneAndUpdate
   * returns null, and we reject the bid.  The losing client receives
   * a clear error and can retry with the latest amount.
   *
   * This is a lock-free approach that:
   *   • Requires no distributed locks or queues
   *   • Scales horizontally (MongoDB serialises the writes)
   *   • Works correctly across multiple Node.js processes
   */
  async processBid(auctionId, userId, amount) {
   * ── Concurrency strategy: Atomic Compare-and-Swap ──────────────────────
   *
   * A naive approach would read the auction, check the current bid in
   * application memory, and then write the new bid.  This creates a race
   * window between the read and the write — two concurrent requests can
   * both read the same `currentHighestBid`, both validate that their bid
   * is higher, and both write, with the second one silently overwriting
   * the first.
   *
   * To prevent this, we use MongoDB's `findOneAndUpdate` with a **conditional
   * filter** that includes the expected `currentHighestBid`.  The operation
   * atomically matches-and-updates in a single round-trip:
   *
   *   { _id, currentHighestBid: <value-we-read> }
   *   → { $set: { currentHighestBid: <new-amount>, highestBidder: <user> } }
   *
   * If another request changed `currentHighestBid` between our read and
   * this write, the filter matches zero documents, `findOneAndUpdate`
   * returns `null`, and we reject the bid.  The losing client receives
   * a clear error and can retry with the latest amount.
   *
   * This is a **pessimism-free, lock-free** approach that:
   *   • Requires no distributed locks or queues
   *   • Scales horizontally (MongoDB serialises the writes)
   *   • Survives server restarts (the DB is the source of truth)
   *   • Works correctly across multiple Node.js processes
   *
   * ── Fallback for edge case ────────────────────────────────────────────
   * If the very first bid is placed so fast that `highestBidder` is still
   * null, the filter still works because we match on `currentHighestBid`,
   * which is always set (defaults to `startingBid`).
   * ──────────────────────────────────────────────────────────────────────
   */
  async processBid(auctionId, userId, amount) {
    // 1. Fetch current auction state (source of truth from DB)
    const auction = await auctionDao.findAuctionById(auctionId);

    if (!auction) {
      const error = new Error('Auction not found');
      error.statusCode = 404;
      throw error;
    }

    // 2. Validate auction is active
    if (auction.status !== 'active') {
      const error = new Error('Auction is not active');
      error.statusCode = 400;
      throw error;
    }

    // 3. Validate amount exceeds current highest bid + min increment
    if (amount <= auction.currentHighestBid) {
      const error = new Error(`Bid must exceed current highest bid of ${auction.currentHighestBid}`);
      error.statusCode = 400;
      throw error;
    }

    const minimumRequired = auction.currentHighestBid + auction.minIncrement;
    if (amount < minimumRequired) {
      const error = new Error(`Bid must be at least ${minimumRequired} (current highest bid + minimum increment)`);
      error.statusCode = 400;
      throw error;
    }

    // 4. Prevent self-outbidding
    if (auction.highestBidder && auction.highestBidder.toString() === userId) {
      const error = new Error('You are already the highest bidder');
      error.statusCode = 400;
      throw error;
    }

    if (auction.seller.toString() === userId) {
      const error = new Error('Seller cannot bid on their own auction');
      error.statusCode = 400;
      throw error;
    }

    /*
     * Atomic compare-and-swap: only succeed if currentHighestBid
     * hasn't changed since we read it.  If it changed, another
     * concurrent bid already won — return null and reject.
     * 5. Atomic compare-and-swap
     *
     * Only succeed if currentHighestBid hasn't changed since we read it.
     * If it changed, another concurrent bid already won — return null
     * and reject this one.
     */
    const updatedAuction = await auctionDao.findAuctionByIdAndUpdateIfHighestBid(
      auctionId,
      auction.currentHighestBid,
      amount,
      userId
    );

    if (!updatedAuction) {
      const error = new Error('Bid was surpassed by another bidder. Please try again with a higher amount.');
      error.statusCode = 409;
      throw error;
    }

    // 6. Persist the bid record
    await bidDao.createBid({
      auction: auctionId,
      bidder: userId,
      amount,
      isWinning: true,
    });

    // 7. Mark previous bids as no longer winning (async — not on critical path)
    if (auction.highestBidder) {
      bidDao.markPreviousBidsAsNotWinning(auctionId, userId).catch(() => {});
    }

    // 8. Create timeline event
    await timelineDao.createTimelineEvent(auctionId, 'bid', {
      amount,
      bidder: userId,
      previousHighestBid: auction.currentHighestBid,
    });

    // 9. Increment bid count (fire-and-forget)
    auctionDao.incrementBidCount(auctionId).catch(() => {});

    return updatedAuction;
  }
}

export default new BidEngineService();
