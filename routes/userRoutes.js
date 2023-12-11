

const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/userControllers');



router.post('/', UsersController.createUsers);
router.get('/', UsersController.ShowUserAll);



module.exports = router;