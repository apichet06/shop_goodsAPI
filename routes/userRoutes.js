const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/userControllers');
const auth = require('../middleware/auth');


router.post('/login', UsersController.login);
router.post('/', auth.authenticateToken, UsersController.CreateUsers);
router.put('/:u_id', auth.authenticateToken, UsersController.UpdateUsers);
router.delete('/:u_id', auth.authenticateToken, UsersController.DeleteUsers);
router.get('/', UsersController.ShowUserAll);

module.exports = router;