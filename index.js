const express = require('express');
const cors = require('cors');
// const db = require('./config/db');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
app.use(cors());
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes);


app.get('/api/', function (req, res) {
    res.send("Welcome to the Google Cloud Platform API");
})

const port = process.env.PORT || 3309;
app.listen(port, () => {
    console.log("server running on port " + port);
});