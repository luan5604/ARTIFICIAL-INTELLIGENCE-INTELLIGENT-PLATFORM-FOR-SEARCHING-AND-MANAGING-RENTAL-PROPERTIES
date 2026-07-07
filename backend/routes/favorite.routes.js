const express = require('express');
const router = express.Router();
const { toggleFavorite, getFavorites } = require('../controllers/favorite.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getFavorites);
router.post('/toggle', protect, toggleFavorite);

module.exports = router;
