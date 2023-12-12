const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/userControllers');


router.post('/login', UsersController.login);
router.post('/', UsersController.CreateUsers);
router.put('/:u_id', UsersController.UpdateUsers);
router.delete('/:u_id', UsersController.DeleteUsers);
router.get('/', UsersController.ShowUserAll);

module.exports = router;