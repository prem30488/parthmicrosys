const app = require('./app');
const sequelize = require('./config/database');

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connected successfully');
        
        // Sync models
        await sequelize.sync({ alter: true });
        console.log('✅ Models synchronized');

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
