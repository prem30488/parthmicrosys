const { Client } = require('pg');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/pdms';
const dbName = 'pdms';

// Parse connection details to connect to default 'postgres' database first
const parseUrl = (url) => {
    const parts = url.replace('postgresql://', '').split('/');
    const [auth, hostPort] = parts[0].split('@');
    return { auth, hostPort };
};

const { auth, hostPort } = parseUrl(dbUrl);
const postgresUrl = `postgresql://${auth}@${hostPort}/postgres`;

async function createDatabase() {
    const client = new Client({
        connectionString: postgresUrl,
    });

    try {
        await client.connect();
        
        // Check if database exists
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
        
        if (res.rowCount === 0) {
            console.log(`🚀 Creating database "${dbName}"...`);
            await client.query(`CREATE DATABASE ${dbName}`);
            console.log(`✅ Database "${dbName}" created successfully.`);
        } else {
            console.log(`ℹ️ Database "${dbName}" already exists.`);
        }
    } catch (err) {
        console.error('❌ Error creating database:', err.message);
    } finally {
        await client.end();
    }
}

createDatabase();
