const express = require('express');
const ProductImportController = require('../controllers/productImportControllers');
const router = express.Router();




router.get('/:data', ProductImportController.GetAllProduct_import)
router.post('/', ProductImportController.CreateProduct_import)
router.delete('/:id', ProductImportController.DeleteProduct_import)
module.exports = router;