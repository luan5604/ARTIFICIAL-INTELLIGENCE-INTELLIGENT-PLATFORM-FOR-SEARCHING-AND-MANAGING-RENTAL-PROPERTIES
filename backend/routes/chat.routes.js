const express = require('express');
const router = express.Router();
const { 
  sendMessage, 
  getMessages,
  getConversations,
  startConversation,
  markAllRead
} = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getConversations);
router.post('/start', startConversation);
router.post('/mark-all-read', markAllRead);
router.post('/send', sendMessage);
router.get('/:conversationId', getMessages);

module.exports = router;
