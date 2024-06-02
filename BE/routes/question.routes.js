const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller.js');

router.post('/postQuestion', questionController.postQuestion);
router.get('/newestQuestions', questionController.getNewestQuestions);
router.get('/questionDetails/:question_id', questionController.getQuestionDetails);


module.exports = router;
