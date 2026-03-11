require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

const startServer = async () => {
    // Start listening immediately to handle health checks and CORS preflights
    const server = app.listen(process.env.PORT || 5000, () => {
        const port = server.address().port;
        console.log(`\n🚀 PDMS Server running on port ${port}`);
        console.log(`📡 API: http://localhost:${port}/api`);
        console.log(`💚 Health: http://localhost:${port}/api/health\n`);
    });

    // Handle database connection in the background
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connected successfully');
        
        // Sync models
        await sequelize.sync({ alter: true });
        console.log('✅ Models synchronized');
    } catch (error) {
        console.error('❌ Database connection/sync failed:', error.message);
        console.log('⚠️  Server is running but database-dependent routes will fail.');
    }
};

startServer();
