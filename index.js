const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRouth = require('./routes/auth');
const userRouth = require('./routes/users');
const productRouth = require('./routes/products');
const orderRouth = require('./routes/orders');
const cartRouth = require('./routes/cart');
dotenv.config();

app.use(express.json());
app.use('/api/auth', authRouth)
app.use('/api/users', userRouth)
app.use('/api/products', productRouth)
app.use('/api/cart', cartRouth)
app.use('/api/orders', orderRouth)

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Database connected');
}).catch(err => {
    console.log(err);
})

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
})

app.listen(process.env.PORT || 5001, () => {
    console.log(`Listening on port ${process.env.PORT || 5001}`);
})