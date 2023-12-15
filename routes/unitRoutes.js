const express = require('express');
const UnitController = require('../controllers/unitControllers');

const router = express.Router();



router.get('/', UnitController.GetUnit)
router.post('/', UnitController.CreateUnit)
router.put('/:id', UnitController.UpdateUnit)

module.exports = router;