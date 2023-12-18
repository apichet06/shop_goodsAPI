const express = require('express')
const OrderController = require('../controllers/orderControllers')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/:order_id', auth.authenticateToken, OrderController.OrderGet)

module.exports = router