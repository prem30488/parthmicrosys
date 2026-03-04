const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');

const startServer = async () => {
    try {
        await connectDB();
        app.listen(env.PORT, () => {
            console.log(`\n🚀 PDMS Server running on port ${env.PORT}`);
            console.log(`📡 API: http://localhost:${env.PORT}/api`);
            console.log(`💚 Health: http://localhost:${env.PORT}/api/health\n`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
