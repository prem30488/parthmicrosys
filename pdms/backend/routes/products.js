const express = require('express');
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/products/export/csv — must be before /:id route
router.get('/export/csv', productController.exportCSV);

// GET /api/products
router.get('/', productController.getProducts);

// GET /api/products/:id
router.get('/:id', productController.getProduct);

// POST /api/products
router.post(
    '/',
    validate([
        body('clientName').trim().notEmpty().withMessage('Client name is required'),
        body('productName').trim().notEmpty().withMessage('Product name is required'),
        body('category')
            .isIn(['Ecommerce', 'RealEstate'])
            .withMessage('Category must be Ecommerce or RealEstate'),
        body('themeName').trim().notEmpty().withMessage('Theme name is required'),
        body('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
        body('paymentStatus')
            .optional()
            .isIn(['Paid', 'Pending', 'Overdue'])
            .withMessage('Payment status must be Paid, Pending, or Overdue'),
    ]),
    productController.createProduct
);

// PUT /api/products/:id
router.put(
    '/:id',
    validate([
        body('clientName').optional().trim().notEmpty().withMessage('Client name cannot be empty'),
        body('productName').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
        body('expiryDate').optional().isISO8601().withMessage('Valid expiry date is required'),
        body('paymentStatus')
            .optional()
            .isIn(['Paid', 'Pending', 'Overdue'])
            .withMessage('Payment status must be Paid, Pending, or Overdue'),
    ]),
    productController.updateProduct
);

// DELETE /api/products/:id
router.delete('/:id', productController.deleteProduct);

module.exports = router;
