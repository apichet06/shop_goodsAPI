
const express = require('express');
const PaymentController = require('../controllers/paymentControllers');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth.authenticateToken, PaymentController.CreatePayment)

module.exports = router;


