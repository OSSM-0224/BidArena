import { Server } from 'socket.io';
import config from './env.js';

let io = null;

/*
 * Initialise the Socket.io server attached to an HTTP server instance.
 * Called once during server bootstrap (see server.js).
 */
export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  return io;
};

/*
 * Retrieve the active Socket.io instance.
 * Throws if called before initialiseSocket() — this is intentional so
 * downstream services (e.g. timer.service) can detect startup ordering.
 */
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialised yet');
  }
  return io;
};
