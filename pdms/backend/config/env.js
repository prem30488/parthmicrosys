const defaultDb = 'postgresql://postgres:postgres@localhost:5432/pdms?schema=public';

module.exports = {
    PORT: process.env.PORT || 5000,
    DATABASE_URL: (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'null') ? process.env.DATABASE_URL : defaultDb,
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
    JWT_EXPIRES_IN: '1h',
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_OWNER: process.env.GITHUB_OWNER,
    GITHUB_TEMPLATE_ECOMMERCE: process.env.GITHUB_TEMPLATE_ECOMMERCE || 'ecommerce-template',
    GITHUB_TEMPLATE_REALESTATE: process.env.GITHUB_TEMPLATE_REALESTATE || 'realestate-template',
    VERCEL_TOKEN: process.env.VERCEL_TOKEN,
    VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
};
