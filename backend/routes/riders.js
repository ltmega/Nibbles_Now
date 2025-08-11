const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Example: Get all users (replace with real controller logic)
router.get('/', (req, res) => {
    pool.query('SELECT * FROM riders', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        res.json(results);
    });
});

module.exports=router;