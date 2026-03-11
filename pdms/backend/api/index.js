require('dotenv').config();
const app = require('../app');
const sequelize = require('../config/database');

let isConnected = false;

const connectDb = async () => {
    if (isConnected) return;
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        isConnected = true;
        console.log('✅ Serverless: PostgreSQL connected and synchronized');
    } catch (error) {
        console.error('❌ Serverless: Database connection failed:', error.message);
    }
};

// Vercel Serverless Function entry point
module.exports = async (req, res) => {
    // Ensure DB is connected for this request
    await connectDb();
    
    // Handle the request with Express
    return app(req, res);
};
