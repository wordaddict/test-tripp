/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/**
 * Created by osemeodigie on 04/10/2017.
 * Updated by ifiokidiang on 23/10/2017
 * objective: building to scale
 */


class RabbitMQHelper {
  /**
         * The constructor
         *
         * @param rabbitMQClient - the rabbitMQ client
         */
  constructor(rabbitMQClient) {
    this.rabbitMQClient = rabbitMQClient;
  }

  /**
         * Published a message to the defined queue
         *
         * @param data
         * @param queue
         */
  publish(data, queue) {
    return this.rabbitMQClient.then(connection => connection.createChannel()).then(channel => channel.assertQueue(queue, { durable: true, noAck: false })
      .then((ok) => {
        const response = channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
        channel.close();
        return new Promise((resolve, reject) => resolve(response));
      })).catch(console.warn);
  }

  /**
         * Consumed messages from the queue
         * @param queue
         * @param auto_ack - set this to true if you want messages to be automatically acknowledged
         */
  consume(queue, autoAck = true) {
    return this.rabbitMQClient.then(connection => connection.createChannel()).then(channel => channel.assertQueue(queue).then(ok => channel.consume(queue, (messageObject) => {
      if (messageObject !== null) {
        // this is used to acknowledge that the message was consumed from the queue
        if (autoAck) { return channel.ack(messageObject); }

        return new Promise((resolve, reject) =>
          // first parameter is the message as a string while
          // the second parameter is the actual message object, can be used for explicit ack of message
          resolve({

            msg: messageObject.content.toString(),
            msg_obj: messageObject,
            channel,
          }));
      }
      return null;
    }))).catch(console.warn);
  }


  /**
         * Used to acknowledge messages in a channel
         *
         * @param channel
         * @param message_obj
         * @static method
         * @returns {Promise}
         */
  static acknowledgeMessage(channel, messageObject) {
    return new Promise((resolve, reject) => {
      try {
        channel.ack(messageObject);

        return resolve({

          error: false,
          msg: 'message successfully acknowledged on this channel',
          channel,
        });
      } catch (error) {
        const myError = {
          error: false,
          msg: 'failed to acknowledge message on this channel',
          channel,
        };
        return reject(myError);
      }
    });
  }
}

module.exports = RabbitMQHelper;
