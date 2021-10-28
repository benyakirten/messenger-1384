const router = require("express").Router();
const { Op } = require("sequelize");
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

// expects { conversationId } - to acknowledge an individual message is read
// this route will only be used if a user is receiving messages in a conversation
// and not changing back and forth to other conversations
router.post("/read", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const userId = req.user.id;
    const { messageId, conversationId } = req.body;

    const conversation = await Conversation.findOne({
      where: {
        id: conversationId,
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        }
      }
    });

    if (!conversation) {
      return res.sendStatus(401);
    }

    const message = await Message.findOne({
      where: {
        id: messageId,
        conversationId: conversation.id,
      }
    });

    if (!message) {
      return res.sendStatus(401);
    }

    message.read = true;
    await message.save();
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
