const mysql = require('mysql');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'nibblesdb',
    connectionLimit: 10,
    waitForConnections: true,
});
module.exports = pool;