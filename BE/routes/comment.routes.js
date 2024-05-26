const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller.js');

router.post('/isLiked', commentController.isLiked); 
router.post('/likeComment', commentController.likeComment);
router.post('/removeLike', commentController.removeLike);

module.exports = router;