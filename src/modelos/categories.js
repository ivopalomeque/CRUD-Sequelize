const { sequelize } = require('../conexion/connection')
const { DataTypes } = require('sequelize')

const Category = sequelize.define(
    'Category',
    {
        CategoryID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        CategoryName: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        Description: {
            type: DataTypes.STRING(512),
            allowNull: true,
            default: 'N/A',
        },
        Picture: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
    },
    {
        tableName: 'categories',
        timestamps: false,
    }
)

module.exports = { Category }