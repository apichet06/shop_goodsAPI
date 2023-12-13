const express = require('express');
const ProductController = require('../controllers/productControllers');

const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })


router.get('/:page/:per_page', ProductController.ProductAll);
router.post('/', upload.array('file'), ProductController.CreateProdect)
router.put('/:pro_id', upload.array('file'), ProductController.UpdateProduct)
router.delete('/:pro_id', ProductController.DeleteProduct)

module.exports = router