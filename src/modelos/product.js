const { sequelize } = require('../conexion/connection')
const { DataTypes } = require('sequelize')

const Product = sequelize.define(
  'Product',
  {
    productID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    SupplierID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: 1,
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: 1,
    },
    QuantityPerUnit: {
      type: DataTypes.STRING,
      allowNull: true,
      default: 'N/A',
    },
    UnitPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      default: 0.0,
    },
    UnitsInStock: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      default: 0,
    },
    UnitsOnOrder: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      default: 0,
    },
    ReorderLevel: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      default: 1,
    },
    Discontinued: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      default: 0,
    },
  },
  {
    tableName: 'Products',
    timestamps: false,
  }
)

module.exports = { Product }
