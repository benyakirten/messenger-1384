const Sequelize = require("sequelize");
const db = require("../db");

const userConversation = db.define("user_conversation", {
  lastReadMessage: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: -1,
  },
});

module.exports = userConversation;
