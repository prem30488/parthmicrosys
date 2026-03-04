const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const env = require('./env');

let mongoServer;

const connectDB = async () => {
  try {
    let uri = env.MONGO_URI;

    // If default local URI, use in-memory MongoDB instead
    if (!uri || uri.includes('localhost') || uri.includes('127.0.0.1')) {
      console.log('⏳ Starting in-memory MongoDB...');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log('✅ In-memory MongoDB started');
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
