const express = require('express')
const ImportProductController = require('../controllers/importproductControllers')
const router = express.Router()

router.get('/', ImportProductController.GetAll)
router.post('/', ImportProductController.CreateProduct_import)
router.delete('/:id', ImportProductController.DeleteProduct_import)
module.exports = router
