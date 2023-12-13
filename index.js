const express = require('express');
const cors = require('cors');
// const db = require('./config/db');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const productsType = require('./routes/productTypeRoutes');

app.use(cors());
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/productType', productsType)



app.get('/api/', function (req, res) {
    res.send("Welcome to the Goods Shop API");
})

const port = process.env.PORT || 3309;
app.listen(port, () => {
    console.log("Server Running on Port " + port);
});