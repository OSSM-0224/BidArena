import * as auctionDao from '../dao/auction.dao.js';
import * as bidDao from '../dao/bid.dao.js';
import * as timelineDao from '../dao/timeline.dao.js';

/*
 * Reconnection handler.
 *
 * On reconnect, Socket.io creates a brand-new socket on the server — the old
 * `socket.currentAuctionId` is lost.  The client must tell the server which
 * room to rejoin.  Two mechanisms are supported:
 *
 *   1. Handshake data:  the client includes `auctionId` in the socket.io
 *      auth/query payload during reconnection.
 *   2. Explicit request: the client emits "reconnect-room" after connecting.
 *
 * In both cases the server re-fetches the full state from MongoDB and emits
 * "room-state" — the client never needs a manual page refresh.
 */
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

  /*
   * Auto-rejoin: if the client included auctionId in the handshake data
   * (auth or query), treat this as an implicit reconnection request.
   */
  const handshakeId = socket.handshake.auth?.auctionId || socket.handshake.query?.auctionId;
  if (handshakeId) {
    rejoinAndEmitState(handshakeId);
  }

  /*
   * Explicit reconnection request — the client can fire this at any time
   * to get a fresh state snapshot.
   */
  socket.on('reconnect-room', async (payload, ack) => {
    const auctionId = typeof payload === 'string' ? payload : payload?.auctionId;
    await rejoinAndEmitState(auctionId);
    if (typeof ack === 'function') ack({ success: true });
  });
};
