const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET || 'your_secret_key';

exports.login = (req, res) => {
    const { identifier, username, password, role } = req.body;
    const userField = identifier ? 'username' : 'username';
    const userValue = identifier || username;

    pool.query(
        'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1',
        [userValue, userValue],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err || !isMatch) return res.status(401).json({ message: 'Invalid credentials' });

                // Check if admin login is requested and user is actually admin
                if (role === 'admin' && user.role !== 'admin') {
                    return res.status(401).json({ message: 'Not an admin account.' });
                }

                const token = jwt.sign(
                    { user_id: user.user_id, username: user.username, role: user.role || 'user' },
                    jwtSecret,
                    { expiresIn: '1d' }
                );
                // Only send safe user info (never send password)
                const safeUser = {
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email,
                    full_name: user.full_name,
                    phone_number: user.phone_number,
                    address: user.address,
                    role: user.role || 'user'
                };
                res.json({ token, user: safeUser });
            });
        }
    );
};

exports.register = (req, res) => {
    const { full_name, username, email, password } = req.body;
    if (!full_name || !username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    pool.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        if (results.length > 0) return res.status(409).json({ message: 'Username or email already exists.' });

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ message: 'Error hashing password.' });
            pool.query(
                'INSERT INTO users (full_name, username, email, password) VALUES (?, ?, ?, ?)',
                [full_name, username, email, hash],
                (err, result) => {
                    if (err) return res.status(500).json({ message: 'Database error.' });
                    res.status(201).json({ message: 'User registered successfully.' });
                }
            );
        });
    });
};
exports.getUser = (req, res) => {
    const userId = req.params.id;
    pool.query('SELECT * FROM users WHERE user_id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(results[0]);
    });
}; 
exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const { username, email, full_name, phone_number, address } = req.body;

    pool.query(
        'UPDATE users SET username = ?, email = ?, full_name = ?, phone_number = ?, address = ? WHERE user_id = ?',
        [username, email, full_name, phone_number, address, userId],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
            res.json({ message: 'User updated successfully' });
        }
    );
};
exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    pool.query('DELETE FROM users WHERE user_id = ?', [userId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    });
};
exports.getAllUsers = (req, res) => {
    pool.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
};
exports.getUserByUsername = (req, res) => {
    const username = req.params.username;
    pool.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(results[0]);
    });
};