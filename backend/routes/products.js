const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all products
router.get('/', (req, res) => {
    pool.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        res.json(results);
    });
});

// Get featured snacks (latest 5 available)
router.get('/featured-snacks', (req, res) => {
    pool.query('SELECT * FROM products WHERE is_available = 1 ORDER BY created_at DESC LIMIT 5', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        res.json(results);
    });
});

module.exports = router;