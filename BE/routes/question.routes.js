const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller.js');

router.get('/newestQuestions', questionController.getNewestQuestions);
router.get('/questionDetails/:question_id', questionController.getQuestionDetails);
router.get('/searchQuestions', questionController.getSearchQuestions);

module.exports = router;