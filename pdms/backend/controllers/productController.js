const Product = require('../models/Product');
const generateClientId = require('../utils/generateClientId');
const deploymentService = require('../services/deploymentService');
const { Parser } = require('json2csv');

const { Op } = require('sequelize');

// POST /api/products
exports.createProduct = async (req, res) => {
    try {
        const { clientName, productName, category, themeName, expiryDate, paymentStatus, notes } = req.body;

        const clientId = await generateClientId();

        // Create product record first
        const product = await Product.create({
            clientId,
            clientName,
            productName,
            category,
            themeName,
            expiryDate,
            paymentStatus: paymentStatus || 'Pending',
            notes: notes || '',
            deploymentStatus: 'pending',
            createdById: req.admin.id,
        });

        // Trigger deployment in background
        deploymentService
            .deployProduct(product)
            .then(async (deploymentResult) => {
                await product.update({
                    githubRepoUrl: deploymentResult.githubRepoUrl,
                    vercelDeploymentUrl: deploymentResult.vercelDeploymentUrl,
                    deploymentStatus: 'deployed'
                });
                console.log(`✅ Deployment complete for ${clientId}`);
            })
            .catch(async (error) => {
                console.error(`❌ Deployment failed for ${clientId}:`, error.message);
                await product.update({
                    deploymentStatus: 'failed',
                    notes: `Deployment failed: ${error.message}`
                });
            });

        res.status(201).json({
            success: true,
            message: 'Product created. Deployment in progress...',
            data: product,
        });
    } catch (error) {
        console.error('Create Product Error:', error);
        res.status(500).json({ success: false, message: 'Failed to create product' });
    }
};

// GET /api/products
exports.getProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            category = '',
            sortBy = 'createdAt',
            sortOrder = 'desc',
            paymentStatus = '',
        } = req.query;

        const where = { isDeleted: false };

        // Search filter
        if (search) {
            where[Op.or] = [
                { clientName: { [Op.iLike]: `%${search}%` } },
                { productName: { [Op.iLike]: `%${search}%` } },
                { clientId: { [Op.iLike]: `%${search}%` } },
            ];
        }

        // Category filter
        if (category && ['Ecommerce', 'RealEstate'].includes(category)) {
            where.category = category;
        }

        // Payment status filter
        if (paymentStatus && ['Paid', 'Pending', 'Overdue'].includes(paymentStatus)) {
            where.paymentStatus = paymentStatus;
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);
        
        const { count, rows: products } = await Product.findAndCountAll({
            where,
            order: [[sortBy, sortOrder.toUpperCase()]],
            limit: parseInt(limit),
            offset: offset,
        });

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(count / parseInt(limit)),
                },
            },
        });
    } catch (error) {
        console.error('Get Products Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch products' });
    }
};

// GET /api/products/:id
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: { id: req.params.id, isDeleted: false }
        });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        console.error('Get Product Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch product' });
    }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
    try {
        const allowed = ['clientName', 'productName', 'themeName', 'expiryDate', 'paymentStatus', 'notes', 'version'];
        const updates = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }

        const product = await Product.findOne({
            where: { id: req.params.id, isDeleted: false }
        });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await product.update(updates);

        res.json({ success: true, message: 'Product updated', data: product });
    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update product' });
    }
};

// DELETE /api/products/:id (soft delete)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: { id: req.params.id, isDeleted: false }
        });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await product.update({ isDeleted: true });

        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete product' });
    }
};

// GET /api/products/export/csv
exports.exportCSV = async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: false }).lean();

        const fields = [
            'clientId',
            'clientName',
            'productName',
            'category',
            'themeName',
            'githubRepoUrl',
            'vercelDeploymentUrl',
            'deploymentStatus',
            'expiryDate',
            'paymentStatus',
            'version',
            'notes',
            'createdAt',
        ];

        const parser = new Parser({ fields });
        const csv = parser.parse(products);

        res.header('Content-Type', 'text/csv');
        res.attachment('products_export.csv');
        res.send(csv);
    } catch (error) {
        console.error('Export CSV Error:', error);
        res.status(500).json({ success: false, message: 'Failed to export CSV' });
    }
};
