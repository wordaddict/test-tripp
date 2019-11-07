const mongoose = require('mongoose');
const config = require('../config/config');

const consumerSchema = new mongoose.Schema(
  {
    msisdn: {
        type: String,
        required: true,
        unique: true
      },
    firstname: {
        type: String
      },
    lastname: {
        type: String
      },
    userId: {
      type: String,
      unique: true,
      required:true
    },
  },
  {
    timestamps: true
  }
);


const ConsumerModel = mongoose.model(config.mongo.collections.consumer, consumerSchema);
module.exports = ConsumerModel;

