import * as auctionDao from '../dao/auction.dao.js';
import * as bidDao from '../dao/bid.dao.js';
import * as timelineDao from '../dao/timeline.dao.js';

export const registerAuctionRoomHandlers = (io, socket) => {
  socket.on('join-room', async (payload, ack) => {
    try {
      const auctionId = typeof payload === 'string' ? payload : payload?.auctionId;

      if (!auctionId) {
        if (typeof ack === 'function') ack({ success: false, message: 'auctionId is required' });
        return;
      }

      const auction = await auctionDao.findAuctionById(auctionId);
      if (!auction) {
        if (typeof ack === 'function') ack({ success: false, message: 'Auction not found' });
        return;
      }

      socket.join(auctionId);
      socket.currentAuctionId = auctionId;

      auctionDao.incrementSpectatorCount(auctionId).catch(() => {});

      const [bids, timeline] = await Promise.all([
        bidDao.getBidsByAuction(auctionId),
        timelineDao.getTimelineByAuction(auctionId),
      ]);

      await auction.populate(['seller', 'highestBidder']);

      socket.emit('room-state', { auction, bids, timeline });

      if (typeof ack === 'function') ack({ success: true });
    } catch (err) {
      console.error('[AuctionRoom] Error joining room:', err.message);
      if (typeof ack === 'function') ack({ success: false, message: err.message });
    }
  });

  socket.on('leave-room', async (payload) => {
    try {
      const auctionId = typeof payload === 'string' ? payload : payload?.auctionId;

      if (auctionId) {
        socket.leave(auctionId);

        if (socket.currentAuctionId === auctionId) {
          socket.currentAuctionId = null;
        }

        auctionDao.decrementSpectatorCount(auctionId).catch(() => {});
      }
    } catch (err) {
      console.error('[AuctionRoom] Error leaving room:', err.message);
    }
  });
};
