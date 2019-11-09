const MongoDBHelper = require('../lib/MongoDBHelper');
const RabbitMQHelper = require('../lib/RabbitMQHelper');
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
  constructor(logger, mongoclient, rabbitmq, redis) {
    this.logger = logger;
    this.customer = new MongoDBHelper(mongoclient, ConsumerModel);
    this.contact = new MongoDBHelper(mongoclient, contactModel);
    this.messages = new MongoDBHelper(mongoclient, MessageModel);
    this.rabbitMQClientHelper = new RabbitMQHelper(rabbitmq);
    this.redis = redis;
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
  };

  getUserFromRedis(msisdn){
    return this.redis.getAsync(msisdn);
  }

  saveUserOnRedis(msisdn, param){
    return this.redis.setAsync(msisdn, param)
  }

    /**
   * Push the Uploaded data to the queue
   *
   * @param data:messages
   * @param queueName - the name of the queue to push to
   */
  pushToQueue(data, queueName) {
    const queueData = data;
    this.logger.info(`Data to push to the ${queueName}'s Queue: ${JSON.stringify(queueData)}`);
    return this.rabbitMQClientHelper.publish(queueData, queueName);
  }
}
module.exports = MainServices;
