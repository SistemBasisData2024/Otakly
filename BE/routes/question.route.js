const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller.js');

router.get('/newestQuestions', questionController.getNewestQuestions);

module.exports = router;