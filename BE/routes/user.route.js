const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js'); 

router.post('/login', userController.login);
router.post('/register', userController.register);
router.delete('/deleteUser/:user_id', userController.deleteUser);
router.put('/updateUser/:user_id', userController.updateUser);

module.exports = router;