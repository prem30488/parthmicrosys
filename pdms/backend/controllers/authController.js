const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const env = require('../config/env');

// POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingAdmin = await Admin.findOne({ where: { email: email.toLowerCase() } });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const admin = await Admin.create({
            email,
            password_hash: password,
            role: 'admin',
        });

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            data: admin, // toJSON will handle _id mapping and password exclusion
        });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
};

// POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ where: { email: email.toLowerCase() } });
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: admin.role },
            env.JWT_SECRET,
            { expiresIn: env.JWT_EXPIRES_IN }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                admin,
                expiresIn: 3600,
            },
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
    res.json({
        success: true,
        data: req.admin,
    });
};
