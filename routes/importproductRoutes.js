const express = require('express')
const ImportProductController = require('../controllers/importproductControllers')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/', auth.authenticateToken, ImportProductController.GetAll)
router.post('/', auth.authenticateToken, ImportProductController.CreateProduct_import)
router.delete('/:id', auth.authenticateToken, ImportProductController.DeleteProduct_import)
module.exports = router
