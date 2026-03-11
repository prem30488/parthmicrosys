const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase());
    },
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'superadmin'),
    defaultValue: 'admin',
  },
}, {
  hooks: {
    beforeSave: async (admin) => {
      if (admin.changed('password_hash')) {
        const salt = await bcrypt.genSalt(12);
        admin.password_hash = await bcrypt.hash(admin.password_hash, salt);
      }
    },
  },
  timestamps: true,
  updatedAt: false, // Matches original Mongoose config { timestamps: { createdAt: 'createdAt', updatedAt: false } }
});

Admin.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

Admin.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id; // Legacy support for frontend
  delete values.password_hash;
  return values;
};

module.exports = Admin;
