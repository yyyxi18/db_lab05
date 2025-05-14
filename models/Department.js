const { sequelize, DataTypes } = require('../orm');

const Department = sequelize.define('Department', {
  Department_ID: {
    type: DataTypes.STRING(5),
    primaryKey: true
  },
  Department_Name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  Building: DataTypes.STRING(30),
  Budget: DataTypes.DECIMAL(12, 2)
}, {
  tableName: 'DEPARTMENT',
  timestamps: false
});

module.exports = Department;
