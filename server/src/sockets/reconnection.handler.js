import * as auctionDao from '../dao/auction.dao.js';
import * as bidDao from '../dao/bid.dao.js';
import * as timelineDao from '../dao/timeline.dao.js';

export const registerReconnectionHandlers = (io, socket) => {
  const rejoinAndEmitState = async (auctionId) => {
    if (!auctionId) return;

    try {
      const auction = await auctionDao.findAuctionById(auctionId);
      if (!auction) return;

      socket.join(auctionId);
      socket.currentAuctionId = auctionId;

      const [bids, timeline] = await Promise.all([
        bidDao.getBidsByAuction(auctionId),
        timelineDao.getTimelineByAuction(auctionId),
      ]);

      await auction.populate(['seller', 'highestBidder']);

      socket.emit('room-state', { auction, bids, timeline });
    } catch (err) {
      console.error('[Reconnection] Failed to refresh state:', err.message);
    }
  };

  const handshakeId = socket.handshake.auth?.auctionId || socket.handshake.query?.auctionId;
  if (handshakeId) {
    rejoinAndEmitState(handshakeId);
  }

  socket.on('reconnect-room', async (payload, ack) => {
    const auctionId = typeof payload === 'string' ? payload : payload?.auctionId;
    await rejoinAndEmitState(auctionId);
    if (typeof ack === 'function') ack({ success: true });
  });
};
