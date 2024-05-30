const express = require('express');
const subjectController = require('../controllers/subject.controller.js');
const router = express.Router();

router.get('/subjects', subjectController.getSubjects);

module.exports = router;
