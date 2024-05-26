const express = require('express');
const router = express.Router();
const rankController = require('../controllers/rank.controller.js');

router.get('/getRank', rankController.getRank);
router.get('/getUserRank/:user_id', rankController.getUserRank);
router.get('/getRankBySubject/:subject_id', rankController.getRankBySubject);

module.exports = router;
