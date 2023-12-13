const express = require('express')
const ProductTypeController = require("../controllers/productTypeControllers");

const router = express.Router()


router.get('/', ProductTypeController.ShowAllProductType)
router.post('/', ProductTypeController.CreateProductType)
router.put('/:type_id', ProductTypeController.UpdateProductType)
router.delete('/:type_id', ProductTypeController.DeleteProductType)

module.exports = router