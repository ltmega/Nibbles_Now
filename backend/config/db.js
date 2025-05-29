const mysql = require('mysql');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'myconnection',
    password: 'david',
    database: 'nibblesdb',
    connectionLimit: 10,
    waitForConnections: true,
});
module.exports = pool;