import http from 'http';
import connectDB from './src/config/db.js';
import app from './src/app.js';
import config from './src/config/env.js';
import { initializeSocket } from './src/config/socket.js';
import { setupSocketHandlers } from './src/sockets/index.js';

const bootstrapServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    const io = initializeSocket(server);
    setupSocketHandlers(io);

    server.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to initialize the server:', error.message);
    process.exit(1);
  }
};

bootstrapServer();
