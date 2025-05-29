
const pool = require('../config/db');

exports.getAllProducts = (req, res) => {
    pool.query('SELECT * FROM products WHERE is_available = 1', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching products' });
        res.json(results);
    });
};

exports.getFeaturedSnacks = (req, res) => {
    pool.query('SELECT * FROM products WHERE is_available = 1 ORDER BY created_at DESC LIMIT 5', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching featured snacks' });
        res.json(results);
    });
};