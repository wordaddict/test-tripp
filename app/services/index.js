const MongoDBHelper = require('../lib/MongoDBHelper');
const ConsumerModel = require('../models/consumer');
const contactModel = require('../models/contact');
const MessageModel = require('../models/message');

class MainServices {
  /**
   * The constructor
   *
   * @param logger
   * @param mongoclient
   */
  constructor(logger, mongoclient) {
    this.logger = logger;
    this.customer = new MongoDBHelper(mongoclient, ConsumerModel);
    this.contact = new MongoDBHelper(mongoclient, contactModel);
    this.messages = new MongoDBHelper(mongoclient, MessageModel);
  }

  createCustomer(param){
    return this.customer.save(param)
  };

  findUser(param){
    return this.customer.getOne(param);
  }

  addNewContacts(param){
    return this.contact.save(param);
  }

  getContactsWithContactList(params){
    return this.contact.getMSISDN(params)
  }

  saveMessagesInDB(param){
    return this.messages.save(param);
  }
}
module.exports = MainServices;
