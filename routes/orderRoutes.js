const express = require('express')
const OrderController = require('../controllers/orderControllers')
const router = express.Router()

router.get('/:order_id', OrderController.OrderGet)

module.exports = router