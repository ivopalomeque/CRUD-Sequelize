const { sequelize } = require('../conexion/connection')
const { DataTypes } = require('sequelize')

const Employee = sequelize.define(
  'Employee',
  {
    employeeID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
        FirstName: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    LastName: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    Title: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    TitleOfCourtesy: {
        type: DataTypes.STRING(25),
        allowNull: false,
    },
    BirthDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    HireDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    Address: {
        type: DataTypes.STRING(60),
        allowNull: true,
        default: 'N/A'
    },
    City: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    Region: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    PostalCode: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    Country: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    HomePhone: {
        type: DataTypes.STRING(24),
        allowNull: false,
    },
    Extension: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    Photo: {
        type: DataTypes.BLOB,
        allowNull: false,
    },
    Notes: {
        type: DataTypes.STRING(512),
        allowNull: false,
    },
    ReportsTo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Region: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
  },
  {
    tableName: 'Employees',
    timestamps: false,
  }
)

module.exports = { Employee }
