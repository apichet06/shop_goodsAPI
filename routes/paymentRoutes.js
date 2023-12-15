
const express = require('express');
const PaymentController = require('../controllers/paymentControllers');
const router = express.Router();

router.post('/', PaymentController.CreatePayment)

module.exports = router;


