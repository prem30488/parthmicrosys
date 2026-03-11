require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://rare-tops-woodcock.ngrok-free.app:27017/pdms',
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
    JWT_EXPIRES_IN: '1h',
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_OWNER: process.env.GITHUB_OWNER,
    GITHUB_TEMPLATE_ECOMMERCE: process.env.GITHUB_TEMPLATE_ECOMMERCE || 'ecommerce-template',
    GITHUB_TEMPLATE_REALESTATE: process.env.GITHUB_TEMPLATE_REALESTATE || 'realestate-template',
    VERCEL_TOKEN: process.env.VERCEL_TOKEN,
    VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
};
