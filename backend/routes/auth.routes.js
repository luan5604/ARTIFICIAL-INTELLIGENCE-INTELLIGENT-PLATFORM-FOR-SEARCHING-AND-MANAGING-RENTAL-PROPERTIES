const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, changePassword, getSessions, deleteSession } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/sessions', protect, getSessions);
router.delete('/sessions/:id', protect, deleteSession);

module.exports = router;
