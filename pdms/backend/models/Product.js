const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        clientId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        clientName: {
            type: String,
            required: [true, 'Client name is required'],
            trim: true,
        },
        productName: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['Ecommerce', 'RealEstate'],
        },
        themeName: {
            type: String,
            required: [true, 'Theme name is required'],
            trim: true,
        },
        githubRepoUrl: {
            type: String,
            default: '',
        },
        vercelDeploymentUrl: {
            type: String,
            default: '',
        },
        deploymentStatus: {
            type: String,
            enum: ['pending', 'deploying', 'deployed', 'failed'],
            default: 'pending',
        },
        expiryDate: {
            type: Date,
            required: [true, 'Expiry date is required'],
        },
        paymentStatus: {
            type: String,
            enum: ['Paid', 'Pending', 'Overdue'],
            default: 'Pending',
        },
        version: {
            type: String,
            default: 'v1.0',
        },
        notes: {
            type: String,
            default: '',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
        },
    },
    {
        timestamps: true,
    }
);

// Index for search performance
productSchema.index({ clientName: 'text', productName: 'text', clientId: 'text' });
productSchema.index({ isDeleted: 1 });
productSchema.index({ category: 1 });
productSchema.index({ expiryDate: 1 });

module.exports = mongoose.model('Product', productSchema);
