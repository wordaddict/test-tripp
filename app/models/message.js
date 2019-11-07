const mongoose = require('mongoose');
const config = require('../config/config');

const messageSchema = new mongoose.Schema(
  {
    message: {
        type: String,
        required: true,
      },
    msisdns: {
        type: Array,
        required: true,
      },
    task_id: {
        type: String,
        required: true,
        unique: true
      },
  },
  {
    timestamps: true
  }
);


const MessageModel = mongoose.model(config.mongo.collections.messages, messageSchema);
module.exports = MessageModel;

