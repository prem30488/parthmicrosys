const { Sequelize } = require('sequelize');
const env = require('./env');

const databaseUrl = env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not defined in environment variables');
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: true,
  },
  pool: {
    max: 20,
    min: 0,
    acquire: 120000,
    idle: 10000
  },
  dialectOptions: {
    connectTimeout: 120000,
    ssl: databaseUrl && !databaseUrl.includes('localhost') ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

module.exports = sequelize;
