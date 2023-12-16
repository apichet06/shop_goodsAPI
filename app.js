const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const productTypeRoutes = require('./routes/productTypeRoutes');
const cartItems = require('./routes/cartItemRoutes');
const unitRoutes = require('./routes/unitRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const shippingRoutes = require('./routes/shippingRoutes');
const importProductRoutes = require('./routes/importproductRoutes');


app.use(cors());

app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/productType', productTypeRoutes)
app.use('/api/cartIems', cartItems)
app.use('/api/unit', unitRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/shipping', shippingRoutes)
app.use('/api/importproduct', importProductRoutes)


app.get('/', function (req, res) {
    res.send("Welcome to the API , Goods Shop ");
})

const port = process.env.PORT || 3309;
app.listen(port, () => {
    console.log("Server Running on Port " + port);
});
