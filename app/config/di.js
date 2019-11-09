const config = require('../config/config');
const serviceLocator = require('../lib/service_locator');
const winston = require('winston');
require('winston-daily-rotate-file');

const rabbit = require('amqplib');
const redis = require('redis');

const MainServices = require('../services/index');
const MainController = require('../controllers/index');

const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;
/**
 * Returns an instance of logger
 */
serviceLocator.register('logger', () => {
  let fileTransport = null;
  if (config.logging.file) {
    fileTransport = new (winston.transports.DailyRotateFile)({
      filename: `${config.logging.file}`,
      datePattern: 'yyyy-MM-dd.',
      prepend: true,
      level: config.logging.level,
    });
  }

  const consoleTransport = new (winston.transports.Console)({
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    json: false,
    colorize: true,
    level: config.logging.level,
  });
  const availableTransports = [];
  if (config.logging.file) {
    availableTransports.push(fileTransport);
  }
  if (config.logging.console) {
    availableTransports.push(consoleTransport);
  }
  const winstonLogger = new (winston.createLogger)({
    transports: availableTransports,
  });
  return winstonLogger;
});

/**
 * Returns a Redis connection instance.
 */
serviceLocator.register('redis', (servicelocator) => {
  const logger = servicelocator.get('logger');
  bluebird.promisifyAll(redis.RedisClient.prototype);
  bluebird.promisifyAll(redis.Multi.prototype);
  const connectionParameters = {
    host: config.redis.host,
    port: config.redis.port,
    db: config.redis.database,
  };
  if (config.redis.password) {
    connectionParameters.password = config.redis.password;
  }
  const myRedis = redis.createClient(connectionParameters);
  myRedis.on('connect', () => {
    logger.info(`Redis connection established on ${config.redis.host}:${config.redis.port}`);
  });
  myRedis.on('error', (err) => {
    logger.error(`Connection error : ${err}`);
    myRedis.quit();
    process.exit(1);
  });

  myRedis.on('end', () => {
    logger.error('Redis is shutting down');
    process.exit(1);
  });

  // If the Node process ends, close the Redis connection
  process.on('SIGINT', () => {
    myRedis.quit();
    process.exit(0);
  });


  return myRedis;
});

/**
 * Returns a RabbitMQ connection instance.
 */
serviceLocator.register('rabbitmq', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const connectionString = (!config.rabbitmq.username || !config.rabbitmq.pass) ?
    `amqp://${config.rabbitmq.host}:${config.rabbitmq.port}` :
    `amqp://${config.rabbitmq.user}:${config.rabbitmq.pass}@${config.rabbitmq.host}:${config.rabbitmq.port}`;
  logger.info(`RabbitMQ Connection Established on ${connectionString}`);
  return rabbit.connect(connectionString);
});


/**
 * Returns a Mongo connection instance.
 */

serviceLocator.register('mongo', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const connectionString =
    (!config.mongo.connection.username || !config.mongo.connection.password) ?
      `mongodb://${config.mongo.connection.host}:${config.mongo.connection.port}/${config.mongo.connection.dbProd}` :
      `mongodb://${config.mongo.connection.username}:${config.mongo.connection.password}` +
      `@${config.mongo.connection.host}:${config.mongo.connection.port}/${config.mongo.connection.dbProd}`;
  mongoose.Promise = bluebird;
  const mongo = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true } );
  mongo.then(() => {
      console.log('Mongo Connection Established', connectionString)
  }).catch(() => {
      console.log('Mongo Connection disconnected');
      process.exit(1);
  });

  return mongo;
});


/**
 * Creates an instance of the Main Service
 */
serviceLocator.register('mainService', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const mongoclient = servicelocator.get('mongo');
  const rabbitmq = servicelocator.get('rabbitmq');
  const redis = servicelocator.get('redis');
  return new MainServices(logger, mongoclient, rabbitmq, redis);
});


/**
 * Creates an instance of the Main Controller
 */
serviceLocator.register('mainController', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const mainService = servicelocator.get('mainService');
  return new MainController(logger, mainService);
});

module.exports = serviceLocator;
