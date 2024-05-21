const express = require('express');
const router = express.Router();
const rankController = require('../controllers/rank.controller.js');

router.get('/getRank', rankController.getRank);
router.get('/rank/:userId', rankController.getUserRank);

module.exports = router;
