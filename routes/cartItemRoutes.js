const express = require('express');
const CartItemController = require('../controllers/cartItemControllers');
const auth = require('../middleware/auth');
const router = express.Router();

router.delete('/:id', CartItemController.DeleletCart);
router.post('/', CartItemController.CreateCartItem)
router.put('/:id', CartItemController.UpdateCartItem)
router.get('/', CartItemController.GetCartItem)

module.exports = router;