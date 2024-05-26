const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answer.controller.js');

router.post('/checkUserVote', answerController.CheckUserVote);
router.post('/upvoteAnswer', answerController.Upvote);
router.post('/downvoteAnswer', answerController.Downvote);
router.post('/undownvote', answerController.Undownvote);
router.post('/unupvote', answerController.Unupvote);

module.exports = router;