const Product = require('../models/Product');
const generateClientId = require('../utils/generateClientId');
const deploymentService = require('../services/deploymentService');
const { Parser } = require('json2csv');

// POST /api/products
exports.createProduct = async (req, res) => {
    try {
        const { clientName, productName, category, themeName, expiryDate, paymentStatus, notes } = req.body;

        const clientId = await generateClientId();

        // Create product record first
        const product = new Product({
            clientId,
            clientName,
            productName,
            category,
            themeName,
            expiryDate,
            paymentStatus: paymentStatus || 'Pending',
            notes: notes || '',
            deploymentStatus: 'deploying',
            createdBy: req.admin._id,
        });

        await product.save();

        // Trigger deployment in background
        deploymentService
            .deployProduct(product)
            .then(async (deploymentResult) => {
                product.githubRepoUrl = deploymentResult.githubRepoUrl;
                product.vercelDeploymentUrl = deploymentResult.vercelDeploymentUrl;
                product.deploymentStatus = 'deployed';
                await product.save();
                console.log(`✅ Deployment complete for ${clientId}`);
            })
            .catch(async (error) => {
                console.error(`❌ Deployment failed for ${clientId}:`, error.message);
                product.deploymentStatus = 'failed';
                product.notes = `Deployment failed: ${error.message}`;
                await product.save();
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

        const query = { isDeleted: false };

        // Search filter
        if (search) {
            query.$or = [
                { clientName: { $regex: search, $options: 'i' } },
                { productName: { $regex: search, $options: 'i' } },
                { clientId: { $regex: search, $options: 'i' } },
            ];
        }

        // Category filter
        if (category && ['Ecommerce', 'RealEstate'].includes(category)) {
            query.category = category;
        }

        // Payment status filter
        if (paymentStatus && ['Paid', 'Pending', 'Overdue'].includes(paymentStatus)) {
            query.paymentStatus = paymentStatus;
        }

        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [products, total] = await Promise.all([
            Product.find(query).sort(sort).skip(skip).limit(parseInt(limit)).lean(),
            Product.countDocuments(query),
        ]);

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / parseInt(limit)),
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
        const product = await Product.findOne({ _id: req.params.id, isDeleted: false });
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

        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, message: 'Product updated', data: product });
    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update product' });
    }
};

// DELETE /api/products/:id (soft delete)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { $set: { isDeleted: true } },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

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
