const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js'); 

router.post('/login', userController.login);
router.post('/register', userController.register);
router.delete('/deleteUser/:user_id', userController.deleteUser);
router.put('/updateUserUsername/:user_id', userController.updateUserUsername);
router.put('/updateUserPassword/:user_id', userController.updateUserPassword);
router.put('/updateUserEmail/:user_id', userController.updateUserEmail);
router.put('/updateUserProfilePicture/:user_id', userController.updateUserProfilePicture);


module.exports = router;