

const express = require('express');
const CartItemController = require('../controllers/cartItemControllres');
const router = express.Router();

router.delete('/:id', CartItemController.DeleletCart);
router.post('/', CartItemController.CreateCartItem)
router.put('/:id', CartItemController.UpdateCartItem)

module.exports = router;