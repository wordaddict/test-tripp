const mongoose = require('mongoose');
const config = require('../config/config');

const contactSchema = new mongoose.Schema(
  {
    msisdn: {
        type: String,
        required: true,
        unique: true
      },
    contact_list: {
      type: String,
      required:true
    },
  },
  {
    timestamps: true
  }
);


const contactModel = mongoose.model(config.mongo.collections.contact, contactSchema);
module.exports = contactModel;

