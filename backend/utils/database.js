// Mysql2 is a accessor of mysql database
const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    database:'node_complete',
    password:'1234567890'
})

//Async connection refer document https://www.npmjs.com/package/mysql2 for more info

const Sequelize = require('sequelize');
const sequelize = new Sequelize('node_complete','root','1234567890',{
    dialect:'mysql',
    host: 'localhost'
});

module.exports.mysql = pool.promise();
module.exports.sequelize = sequelize;