const db = require('../models');
const Message = db.Message;
const Conversation = db.Conversation;
const { handleBotQuery } = require('../services/bot.service');

const sendMessage = async (req, res) => {
  try {
    const { conversation_id, content, room_id } = req.body;
    
    // Save user message
    const userMessage = await Message.create({
      conversation_id,
      sender_id: req.user.id,
      content,
      message_type: 'TEXT'
    });

    // Check if it's a bot-handled query (if room_id is provided)
    if (room_id) {
      const botResponse = await handleBotQuery(content, room_id);
      
      if (botResponse) {
        // Save bot message
        const botMessage = await Message.create({
          conversation_id,
          sender_id: null, // null indicates system/bot
          content: botResponse,
          message_type: 'TEXT'
        });
        
        return res.status(201).json({ userMessage, botMessage });
      }
    }

    res.status(201).json({ userMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // Mark messages as read
    await Message.update(
      { is_read: true },
      { 
        where: { 
          conversation_id: conversationId,
          sender_id: { [db.Sequelize.Op.ne]: req.user.id }
        } 
      }
    );

    const messages = await Message.findAll({
      where: { conversation_id: conversationId },
      include: [
        {
          model: db.User,
          as: 'sender',
          include: [{ model: db.Profile }]
        }
      ],
      order: [['created_at', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const role = req.user.Role?.role_name;

    let whereClause = {};
    if (role === 'LANDLORD') {
      whereClause = { landlord_id: req.user.id };
    } else if (role === 'TENANT') {
      whereClause = { tenant_id: req.user.id };
    }

    const conversations = await Conversation.findAll({
      where: whereClause,
      include: [
        { model: db.User, as: 'tenant', include: [db.Profile] },
        { model: db.User, as: 'landlord', include: [db.Profile] },
        {
          model: db.Message,
          limit: 1,
          order: [['created_at', 'DESC']],
          separate: true
        }
      ],
      order: [['updated_at', 'DESC']]
    });

    res.json(conversations);
  } catch (error) {
    console.error('getConversations error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const startConversation = async (req, res) => {
  try {
    const { landlord_id } = req.body;
    const tenant_id = req.user.id;

    if (!landlord_id) {
      return res.status(400).json({ message: 'landlord_id is required' });
    }

    // Find existing conversation
    let conversation = await Conversation.findOne({
      where: {
        tenant_id,
        landlord_id
      }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        tenant_id,
        landlord_id,
        last_message: 'Bắt đầu cuộc trò chuyện mới'
      });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAllRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all conversations for this user
    const conversations = await Conversation.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { tenant_id: userId },
          { landlord_id: userId }
        ]
      },
      attributes: ['id']
    });

    const conversationIds = conversations.map(c => c.id);

    if (conversationIds.length > 0) {
      await Message.update(
        { is_read: true },
        {
          where: {
            conversation_id: { [db.Sequelize.Op.in]: conversationIds },
            sender_id: { [db.Sequelize.Op.ne]: userId }
          }
        }
      );
    }

    res.json({ message: 'All messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getConversations,
  sendMessage,
  getMessages,
  startConversation,
  markAllRead
};
