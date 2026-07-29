import bidEngineService from '../services/bidEngine.service.js';

export const registerBidHandlers = (io, socket) => {
  socket.on('submit-bid', async (payload, ack) => {
    try {
      const { auctionId, amount } = payload || {};

      if (!auctionId || !amount || typeof amount !== 'number' || amount <= 0) {
        socket.emit('bid-error', { message: 'Invalid bid payload. auctionId and a positive amount are required.' });
        if (typeof ack === 'function') ack({ success: false, message: 'Invalid payload' });
        return;
      }

      const updatedAuction = await bidEngineService.processBid(auctionId, socket.user._id, amount);

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
      const message = err.message || 'Bid processing failed';
      socket.emit('bid-error', { message, statusCode: err.statusCode || 500 });
      if (typeof ack === 'function') ack({ success: false, message });
    }
  });
};
