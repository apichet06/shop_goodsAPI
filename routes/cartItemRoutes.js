

const express = require('express');
const CartItemController = require('../controllers/cartItemControllres');
const router = express.Router();

router.delete('/:id', CartItemController.DeleletCart);

module.exports = router;