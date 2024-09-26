const { Sequelize } = require('sequelize')

process.loadEnvFile()
const { DBUSER, PASSWORD, HOST, DATABASE } = process.env

const sequelize = new Sequelize(DATABASE, DBUSER, PASSWORD, {
  host: HOST,
  dialect: 'mysql',
})

module.exports = { sequelize }
