const express = require('express');
const UnitController = require('../controllers/unitControllers');
const auth = require('../middleware/auth');

const router = express.Router();



router.get('/', auth.authenticateToken, UnitController.GetUnit)
router.post('/', auth.authenticateToken, UnitController.CreateUnit)
router.put('/:id', auth.authenticateToken, UnitController.UpdateUnit)

module.exports = router;