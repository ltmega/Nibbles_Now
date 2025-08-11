const express = require('express');
const router = express.Router();
const pool = require('../config/db');


// Example: Get all orders (replace with real controller logic)
router.get('/', (req, res) => {
    pool.query('SELECT * FROM orders', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        res.json(results);
    });
});


// Place a new order
router.post('/', (req, res) => {
    const { userId, deliveryAddress, cart } = req.body;
    if (!cart || !cart.length) return res.status(400).json({ message: 'Cart is empty.' });
    if (!userId) return res.status(400).json({ message: 'User ID is required.' });

    // Calculate total_amount
    const totalAmount = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

    // Insert order
    pool.query(
        'INSERT INTO orders (user_id, total_amount, delivery_address) VALUES (?, ?, ?)',
        [userId, totalAmount, deliveryAddress],
        (err, orderResult) => {
            if (err) {
                console.error('Order insert error:', err);
                return res.status(500).json({ message: 'Order insert error.' });
            }

            const orderId = orderResult.insertId;
            // Insert order items
            const items = cart.map(item => [orderId, item.product_id, item.quantity, item.price]);
            pool.query(
                'INSERT INTO order_items (order_id, product_id, quantity, item_price) VALUES ?',
                [items],
                (err2) => {
                    if (err2) {
                        console.error('Order items insert error:', err2);
                        return res.status(500).json({ message: 'Order items insert error.' });
                    }
                    console.log('Order saved:', { orderId, userId, totalAmount, deliveryAddress, cart });
                    res.json({ message: 'Order placed successfully!' });
                }
            );
        }
    );
});

module.exports = router;