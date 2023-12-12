const express = require('express');
const ProductController = require('../controllers/productControllers');

const router = express.Router();

router.get('/:page/:per_page', ProductController.ProductAll);



module.exports = router