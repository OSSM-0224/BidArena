import connectDB from './src/config/db.js';
import app from './src/app.js';
import config from './src/config/env.js';

const start = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

start();
