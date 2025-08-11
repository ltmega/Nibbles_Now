// backend/routes/categories.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticateToken, authorizeRole } = require('../middleware/auth'); // Import auth middleware

// Helper function to execute database queries with promises
const query = (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
};

// Get all categories (basic list) - Accessible by anyone
router.get('/', async (req, res) => {
    try {
        const results = await query('SELECT * FROM categories');
        res.json(results);
    } catch (error) {
        console.error('Database error fetching categories:', error);
        res.status(500).json({ message: 'Failed to fetch categories due to a server error.' });
    }
});

// Get all categories with their products - Accessible by anyone
router.get('/with-products', async (req, res) => {
    const sql = `
        SELECT c.category_id, c.category_name,
               p.product_id, p.product_name, p.description, p.price, p.image_url, p.is_available
        FROM categories c
        LEFT JOIN products p ON c.category_id = p.category_id
        ORDER BY c.category_id, p.product_id
    `;
    try {
        const results = await query(sql);
        // Group products under their categories
        const categories = {};
        results.forEach(row => {
            if (!categories[row.category_id]) {
                categories[row.category_id] = {
                    category_id: row.category_id,
                    category_name: row.category_name,
                    products: []
                };
            }
            if (row.product_id) { // Only push product if it exists (for LEFT JOIN)
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
    } catch (error) {
        console.error('Database error fetching categories with products:', error);
        res.status(500).json({ message: 'Failed to fetch categories with products due to a server error.' });
    }
});

// Add a new category - Admin only
router.post('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const { category_name } = req.body;
    if (!category_name) {
        return res.status(400).json({ message: 'Category name is required.' });
    }
    try {
        const result = await query('INSERT INTO categories (category_name) VALUES (?)', [category_name]);
        res.status(201).json({ message: 'Category added successfully!', categoryId: result.insertId });
    } catch (error) {
        console.error('Error adding category:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Category name already exists.' });
        }
        res.status(500).json({ message: 'Failed to add category due to a server error.' });
    }
});

// Update a category - Admin only
router.put('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const { id } = req.params;
    const { category_name } = req.body;
    if (!category_name) {
        return res.status(400).json({ message: 'Category name is required.' });
    }
    try {
        const result = await query('UPDATE categories SET category_name = ? WHERE category_id = ?', [category_name, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        res.status(200).json({ message: 'Category updated successfully.' });
    } catch (error) {
        console.error('Error updating category:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Category name already exists.' });
        }
        res.status(500).json({ message: 'Failed to update category due to a server error.' });
    }
});

// Delete a category - Admin only
router.delete('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const { id } = req.params;
    try {
        // First, check if any products are linked to this category
        const productsCount = await query('SELECT COUNT(*) AS count FROM products WHERE category_id = ?', [id]);
        if (productsCount[0].count > 0) {
            return res.status(400).json({ message: 'Cannot delete category: Products are linked to it. Please reassign or delete products first.' });
        }

        const result = await query('DELETE FROM categories WHERE category_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Failed to delete category due to a server error.' });
    }
});

module.exports = router;