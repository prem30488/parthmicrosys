const jwt = require('jsonwebtoken');
const env = require('../config/env');
const Admin = require('../models/Admin');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, env.JWT_SECRET);

        const admin = await Admin.findById(decoded.id).select('-password_hash');
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Token is invalid. User not found.' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token.' });
        }
        return res.status(500).json({ success: false, message: 'Authentication error.' });
    }
};

module.exports = auth;
