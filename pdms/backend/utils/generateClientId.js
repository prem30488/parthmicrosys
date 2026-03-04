const Product = require('../models/Product');

/**
 * Generate a unique client ID in format CL-00001, CL-00002, etc.
 */
const generateClientId = async () => {
    const lastProduct = await Product.findOne({}, { clientId: 1 })
        .sort({ createdAt: -1 })
        .lean();

    if (!lastProduct || !lastProduct.clientId) {
        return 'CL-00001';
    }

    const lastNumber = parseInt(lastProduct.clientId.replace('CL-', ''), 10);
    const nextNumber = lastNumber + 1;
    return `CL-${String(nextNumber).padStart(5, '0')}`;
};

module.exports = generateClientId;
