const express = require('express');
const router = express.Router();
const { askAI } = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/ask', askAI);

module.exports = router;
