import bidEngineService from '../services/bidEngine.service.js';

/*
 * Bid submission handler.
 *
 * "submit-bid":  client sends { auctionId, amount }.
 *                The handler validates the socket is authenticated, delegates
 *                to bidEngine.processBid() (which handles atomic concurrency),
 *                then broadcasts the result or emits an error.
 *
 *                On success:  "bid-update"  → entire room
 *                On failure:  "bid-error"   → sending socket only
 */
export const registerBidHandlers = (io, socket) => {
  socket.on('submit-bid', async (payload, ack) => {
    try {
      const { auctionId, amount } = payload || {};

      // Validate payload shape before hitting the service
      if (!auctionId || !amount || typeof amount !== 'number' || amount <= 0) {
        socket.emit('bid-error', { message: 'Invalid bid payload. auctionId and a positive amount are required.' });
        if (typeof ack === 'function') ack({ success: false, message: 'Invalid payload' });
        return;
      }

      const updatedAuction = await bidEngineService.processBid(auctionId, socket.user._id, amount);

      // Broadcast the updated state to everyone in the room
      io.to(auctionId).emit('bid-update', {
        auctionId,
        currentHighestBid: updatedAuction.currentHighestBid,
        highestBidder: updatedAuction.highestBidder,
        bidCount: updatedAuction.bidCount,
        amount,
        bidder: socket.user._id,
        timestamp: new Date(),
      });

      if (typeof ack === 'function') ack({ success: true, auction: updatedAuction });
    } catch (err) {
      // Known application errors (validation, race loss, etc.)
      const message = err.message || 'Bid processing failed';
      socket.emit('bid-error', { message, statusCode: err.statusCode || 500 });
      if (typeof ack === 'function') ack({ success: false, message });
    }
  });
};
