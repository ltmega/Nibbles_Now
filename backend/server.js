const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const db = require('./config/db');
const authRoutes = require('./routes/auth.js');
const productRoutes = require('./routes/products.js');
const orderRoutes = require('./routes/orders.js');
const userRoutes = require('./routes/users.js');
const categoriesRoutes = require('./routes/categories.js');

db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Database connected!');
        connection.release();
    }
});

const path = require('path');
// Initialize Express app
const app = express();
const port = 3000;

app.use('/frontend', express.static(path.join(__dirname, '../frontend')));

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);

app.get('/', (req, res) => res.send('Nibbles Now API Running!'));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});