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

// --------------- Security & CORS Middleware ---------------
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://parthmicrosys.vercel.app',
    'https://parthmicrosys.vercel.app',
    'https://parthmicrosys-dpy5.vercel.app'
];

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
    })
);

// Explicitly handle preflight requests for all routes
app.options('*', cors());

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

// --------------- Routes ---------------
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'PDMS API is running', timestamp: new Date().toISOString() });
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
