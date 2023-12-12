const express = require('express');
const ProductController = require('../controllers/productControllers');

const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })


router.get('/:page/:per_page', ProductController.ProductAll);
router.post('/', upload.array('file'), ProductController.CreateProdect)


module.exports = router