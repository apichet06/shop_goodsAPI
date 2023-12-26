const express = require('express');
const ShippingController = require('../controllers/shippingControllers');
const router = express.Router();

const multer = require('multer');
const auth = require('../middleware/auth');
const upload = multer({ dest: 'uploads/' })


router.post('/', upload.single('file'), auth.authenticateToken, ShippingController.CreateShipping);

module.exports = router;