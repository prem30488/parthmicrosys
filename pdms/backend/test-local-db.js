const Admin = require('./models/Admin');
const Product = require('./models/Product');
const sequelize = require('./config/database');

async function testConnection() {
    console.log(`🔍 Testing connection to: ${require('./config/env').DATABASE_URL}`);
    try {
        await sequelize.authenticate();
        console.log('✅ Connection has been established successfully.');
        
        await sequelize.sync({ alter: true });
        console.log('✅ All models were synchronized successfully.');
        
        const adminCount = await Admin.count();
        console.log(`📊 Number of admins: ${adminCount}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
}

testConnection();
