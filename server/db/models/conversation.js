const { Op } = require("sequelize");
const db = require("../db");
const UserConversation = require("./userConversation");
const Message = require("./message");
const User = require("./user");

// Helper function to reduce repeated logic
async function tryOrReturnNull(fn, thisArg = null, ...args) {
  try {
    const res = await fn.apply(thisArg, args);
    return res;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const Conversation = db.define("conversation", {});

// Add all users in an array to a conversation, users should be an array (or iterable) and firstMessage a Message type without a conversationId
// This method will be called in one of two situations:
// 1. when a user sends a message in a conversation for the first time
// 2. when someone invites a third person to a conversation before a message has been sent
Conversation.startConversation = function (users, firstMessage) {
  return tryOrReturnNull(async () => {
    const conversation = await Conversation.create();
    await conversation.addUser(users, { through: { lastReadMessage: -1 } });
    if (firstMessage) {
      await Message.create({
        ...firstMessage,
        conversationId: conversation.id,
      });
    }
    return conversation;
  });
};

Conversation.joinConversation = function (conversationId, userId) {
  return tryOrReturnNull(async () => {
    const conversation = await Conversation.findOne({
      where: {
        id: conversationId,
      },
      include: [
        {
          model: User,
          attributes: ["id"],
        },
        { model: Message },
      ],
    });

    // it is easy to test if a conversation has a user in the query, but it is harder to test that a conversation doesn't have a user
    const allUsers = conversation.toJSON().users
    if (allUsers.find(user => user.id === userId)) {
      throw new Error(`User with ID ${userId} already part of conversation with ID ${conversationId}`);
    }

     // Either the new user's position can default to -1 or the current message count - 1
    await conversation.addUser(userId, {
      through: { lastReadMessage: conversation.messages.length - 1 },
    });
    return conversation;
  });
};

Conversation.leaveConversation = function (conversationId, userId) {
  return tryOrReturnNull(async () => {
    const conversation = await Conversation.findOne({
      where: {
        id: conversationId,
      },
      include: [
        {
          model: User,
          where: {
            id: userId,
          },
          attributes: ["id"],
        },
      ],
    });

    await conversation.removeUser(userId);
    return conversation;
  });
};

Conversation.readConversation = function (conversationId, userId) {
  return tryOrReturnNull(async () => {
    const conversation = await Conversation.findOne({
      where: {
        id: conversationId,
      },
      include: [
        { model: Message },
        {
          model: User,
          where: {
            id: userId,
          },
          attributes: ["id"],
        },
      ],
    });

    const updatedLastReadMessageIndex = conversation.messages.length - 1;

    const userConversation = await UserConversation.findOne({
      where: { conversationId, userId },
    });

    await userConversation.update({
      lastReadMessage: updatedLastReadMessageIndex,
    });

    return updatedLastReadMessageIndex;
  });
};

module.exports = Conversation;
