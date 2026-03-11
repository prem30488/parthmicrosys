const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  clientId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  clientName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('Ecommerce', 'RealEstate'),
    allowNull: false,
  },
  themeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  githubRepoUrl: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  vercelDeploymentUrl: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  deploymentStatus: {
    type: DataTypes.ENUM('pending', 'deploying', 'deployed', 'failed'),
    defaultValue: 'pending',
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM('Paid', 'Pending', 'Overdue'),
    defaultValue: 'Pending',
  },
  version: {
    type: DataTypes.STRING,
    defaultValue: 'v1.0',
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdById: {
    type: DataTypes.UUID,
    allowNull: true,
  },
}, {
  timestamps: true,
  indexes: [
    { fields: ['clientId'] },
    { fields: ['isDeleted'] },
    { fields: ['category'] },
    { fields: ['expiryDate'] },
  ],
});

Product.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id; // Legacy support for frontend
  return values;
};

// Relationships
const Admin = require('./Admin');
Product.belongsTo(Admin, { as: 'creator', foreignKey: 'createdById' });
Admin.hasMany(Product, { foreignKey: 'createdById' });

module.exports = Product;
