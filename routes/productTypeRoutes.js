const express = require('express')
const ProductTypeController = require("../controllers/productTypeControllers");
const auth = require('../middleware/auth');

const router = express.Router()


router.get('/', auth.authenticateToken, ProductTypeController.ShowAllProductType)
router.post('/', auth.authenticateToken, ProductTypeController.CreateProductType)
router.put('/:type_id', auth.authenticateToken, ProductTypeController.UpdateProductType)
router.delete('/:type_id', auth.authenticateToken, ProductTypeController.DeleteProductType)

module.exports = router