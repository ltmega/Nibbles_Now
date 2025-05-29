const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all categories
router.get('/', (req, res) => {
    pool.query('SELECT * FROM categories', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        res.json(results);
    });
});

// Get all categories with their products
router.get('/with-products', (req, res) => {
    const sql = `
        SELECT c.category_id, c.category_name, 
               p.product_id, p.product_name, p.description, p.price, p.image_url, p.is_available
        FROM categories c
        LEFT JOIN products p ON c.category_id = p.category_id
        ORDER BY c.category_id, p.product_id
    `;
    pool.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });

        // Group products under their categories
        const categories = {};
        results.forEach(row => {
            if (!categories[row.category_id]) {
                categories[row.category_id] = {
                    category_id: row.category_id,
                    category_name: row.category_name,
                    category_description: row.category_description,
                    products: []
                };
            }
            if (row.product_id) {
                categories[row.category_id].products.push({
                    product_id: row.product_id,
                    product_name: row.product_name,
                    description: row.description,
                    price: row.price,
                    image_url: row.image_url,
                    is_available: row.is_available
                });
            }
        });
        res.json(Object.values(categories));
    });
});

module.exports = router;