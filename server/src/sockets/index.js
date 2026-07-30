import { verifyAccessToken } from '../utils/jwtHelper.js';
import { findUserById } from '../dao/user.dao.js';
import { registerAuctionRoomHandlers } from './auctionRoom.handler.js';
import { registerBidHandlers } from './bid.handler.js';
import { registerReconnectionHandlers } from './reconnection.handler.js';
import timerService from '../services/timer.service.js';

/*
 * Socket middleware — authenticate every connection via JWT.
 * The client must provide the token through one of these methods
 * (checked in order of precedence):
 *   1. socket.handshake.auth.token
 *   2. socket.handshake.query.token
 *   3. socket.handshake.headers.authorization (Bearer <token>)
 */
const authenticateSocket = async (socket, next) => {
  try {
    const authHeader = socket.handshake.headers?.authorization;
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.query?.token ||
      (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);

    if (!token) {
      return next(new Error('Authentication required'));
    }

    const decoded = verifyAccessToken(token);
    const user = await findUserById(decoded.id);

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new Error('Invalid or expired token'));
    }
    next(err);
  }
};

/*
 * Initialise all socket event handlers and start timers for active auctions.
 * Called once during server bootstrap after Socket.io is created.
 */
export const setupSocketHandlers = (io) => {
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    socket.join(`user:${socket.user._id}`);

    registerAuctionRoomHandlers(io, socket);
    registerBidHandlers(io, socket);
    registerReconnectionHandlers(io, socket);

    socket.emit('connected', { userId: socket.user._id });
  });

  // Start timers for any active auctions that survived a restart
  timerService.initActiveTimers().catch((err) => {
    console.error('[Socket] Failed to initialise auction timers:', err.message);
  });
};
