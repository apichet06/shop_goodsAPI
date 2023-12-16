const express = require('express')
const ImportProductController = require('../controllers/importproductControllers')
const router = express.Router()

router.get('/:data', ImportProductController.GetAll)

module.exports = router
