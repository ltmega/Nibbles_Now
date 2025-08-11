  const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const multer = require('multer');
const path = require('path');

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../images'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + '-' + Date.now() + ext;
        cb(null, filename);
    }
});
const upload = multer({ storage: storage });

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

// Add new product
router.post('/', upload.single('image'), (req, res) => {
    const { name, description, price, category } = req.body;
    const image_url = req.file ? `/images/${req.file.filename}` : '';
    pool.query(
        'INSERT INTO products (name, description, price, category_id, image_url, is_available) VALUES (?, ?, ?, ?, ?, 1)',
        [name, description, price, category, image_url],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Error adding product' });
            res.json({ success: true, product_id: result.insertId });
        }
    );
});

// Update product (with fallback for image_url)
router.put('/:id', upload.single('image'), (req, res) => {
    const { name, description, price, category } = req.body;
    let image_url = req.file ? `/images/${req.file.filename}` : req.body.image_url;

    function updateProduct(finalImageUrl) {
        pool.query(
            'UPDATE products SET name=?, description=?, price=?, category_id=?, image_url=? WHERE product_id=?',
            [name, description, price, category, finalImageUrl, req.params.id],
            (err) => {
                if (err) return res.status(500).json({ message: 'Error updating product' });
                res.json({ success: true });
            }
        );
    }

    if (!image_url) {
        // Fetch current image_url from DB if not provided
        pool.query('SELECT image_url FROM products WHERE product_id=?', [req.params.id], (err, results) => {
            if (err || !results.length) return res.status(500).json({ message: 'Error fetching current image' });
            updateProduct(results[0].image_url);
        });
    } else {
        updateProduct(image_url);
    }
});

// Delete product
router.delete('/:id', (req, res) => {
    pool.query('DELETE FROM products WHERE product_id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: 'Error deleting product' });
        res.json({ success: true });
    });
});

module.exports = router;