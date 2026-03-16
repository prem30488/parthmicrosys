const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// Route imports
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// --------------- Manual CORS Middleware ---------------
// Standard CORS packages can be finicky on specific Vercel deployments.
// Manual implementation at the top of the stack ensures preflights succeed first.
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://parthmicrosys.vercel.app',
    'https://parthmicrosys.vercel.app'
];

app.use((req, res, next) => {
    const origin = req.headers.origin;

    // Slash-agnostic origin check
    const normalizedOrigin = origin ? origin.replace(/\/$/, '') : null;
    const isAllowed = origin && allowedOrigins.some(ao => ao.replace(/\/$/, '') === normalizedOrigin);

    if (isAllowed) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else if (!origin) {
        // Fallback for non-browser requests (Postman, curl)
        res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Accept, X-Api-Version');

    // Handle Preflight OPTIONS immediately
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: 'Too many auth attempts, please try again later.' },
});
app.use('/api/auth', authLimiter);

// --------------- Body Parsing ---------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --------------- Logging ---------------
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}
app.options("*", cors());

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
// --------------- Routes ---------------
app.get('/api/health', async (req, res) => {
    //res.json({ success: true, message: 'PDMS API is running', timestamp: new Date().toISOString() });
    try {
        await pool.query("SELECT 1");
        res.status(200).json({
            success: true,
            status: "healthy",
            database: "connected",
            message: 'PDMS API is running', timestamp: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            status: "unhealthy " + err.message,
            error: err.message,
            message: 'PDMS API is not running', timestamp: new Date().toISOString()
        });
    }
});


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dashboard', dashboardRoutes);

// --------------- 404 Handler ---------------
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// --------------- Global Error Handler ---------------
app.use((err, req, res, next) => {
    console.error('Global Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
});

module.exports = app;
