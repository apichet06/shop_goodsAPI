const express = require('express');
const ShippingController = require('../controllers/shippingControllers');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'uploads/' })

router.post('/', upload.single('file'), ShippingController.CreateShipping);

module.exports = router;