const express = require('express');
const ProductController = require('../controllers/productControllers');

const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const upload = multer({ dest: 'uploads/' })

router.get('/:pro_id', ProductController.ProductID);
router.get('/pro_type/:type_id', ProductController.ProductTyoeID)
router.get('/:page/:per_page', ProductController.ProductAll);
router.post('/', upload.array('file'), auth.authenticateToken, ProductController.CreateProdect)
router.put('/:pro_id', upload.array('file'), auth.authenticateToken, ProductController.UpdateProduct)
router.delete('/:pro_id', auth.authenticateToken, ProductController.DeleteProduct)

module.exports = router