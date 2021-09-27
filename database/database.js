const Sequelize = require('sequelize')
const connection = new Sequelize('guiaperguntas','root','010204',{
    host:'localhost',
    dialect: 'mysql'
})










module.exports = connection;