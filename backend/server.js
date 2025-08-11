const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const db = require('./config/db');
const authRoutes = require('./routes/auth.js');
const productRoutes = require('./routes/products.js');
const orderRoutes = require('./routes/orders.js');
const userRoutes = require('./routes/users.js');
const categoriesRoutes = require('./routes/categories.js');
const ridersRoutes= require('./routes/riders.js');

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

app.use('/images', express.static(path.join(__dirname, '../images')));

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/riders', ridersRoutes);

app.get('/', (req, res) => res.send('Nibbles Now API Running!'));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});