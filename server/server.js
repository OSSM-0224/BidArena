import connectDB from './src/config/db.js';
import app from './src/app.js';
import config from './src/config/env.js';
const bootstrapServer = async () => {
    try {
        await connectDB();

        app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        });
    } catch (error) {
        console.error("Failed to initialize the server:", error.message);
        process.exit(1);
    }
};

bootstrapServer();
