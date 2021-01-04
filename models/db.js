// mysql2 - (mysql connector)

const mysql = require('mysql2');
const conn = mysql.createConnection({
    host: '127.0.0.1', // mysql 위치 (localhost)
    user: 'root', // username
    password: 'admin1234', // password
    port: '3306', // port,
    database: 'express-board', // Database Name
})

module.exports = conn;