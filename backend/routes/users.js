const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Example: Get all users (replace with real controller logic)
router.get('/', (req, res) => {
    res.json({ message: 'Users route working!' });
});

// Get or create user by username
router.post('/get-or-create', (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: 'Username is required.' });

    pool.query('SELECT user_id FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).json({ message: 'DB error.' });
        if (results.length > 0) {
            // User exists
            return res.json({ userId: results[0].user_id });
        } else {
            // Create user with only username (no password/email for guest checkout)
            pool.query('INSERT INTO users (username) VALUES (?)', [username], (err2, result2) => {
                if (err2) return res.status(500).json({ message: 'DB error.' });
                return res.json({ userId: result2.insertId });
            });
        }
    });
});

// Get user by ID
router.get('/:id', (req, res) => {
    const userId = req.params.id;
    pool.query('SELECT user_id, username, email FROM users WHERE user_id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'DB error.' });
        if (results.length === 0) return res.status(404).json({ message: 'User not found.' });
        res.json(results[0]);
    });
});

// Update user by ID
router.put('/:id', (req, res) => {
    const userId = req.params.id;
    const { username, email, phone_number, address } = req.body;
    pool.query(
        'UPDATE users SET username = ?, email = ? WHERE user_id = ?',
        [username, email, userId],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'DB error.' });
            res.json({ message: 'User updated.' });
        }
    );
});

module.exports = router;