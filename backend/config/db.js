const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nibblesdb',
    connectionLimit: 10,
    waitForConnections: true,
});
module.exports = pool;