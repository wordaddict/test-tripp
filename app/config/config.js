require('dotenv').config();
const app_name = 'Test project MS';

const config = {
  app_name,
  server: {
    url: process.env.APP_URL,
    port: process.env.APP_PORT
  },
  secret: process.env.SECRET,
  mongo: {
    salt_value: 10,
    connection: {
      host: process.env.MONGODB_HOST,
      username: process.env.MONGODB_USER,
      password: process.env.MONGODB_PASSWORD,
      port: process.env.MONGODB_PORT,
      dbProd: process.env.MONGODB_DATABASE_NAME
    },
    collections: {
      consumer: 'consumers',
      contact: 'contacts',
      messages: 'messages',
    },
    queryLimit: process.env.MONGODB_QUERY_LIMIT,
    questionLimit: process.env.QUESTION_LIMIT
  },
  // RABBITMQ
  rabbitmq: {
    connect: `amqp://${process.env.RABBIT_USER}:${process.env.RABBIT_PASS}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}`,
    queue: {
      uploadQueue: 'bulk_Questions_Upload_Queue',
      uploadErrorQueue: 'bulk_Questions_Error_Queue'
    },
    pass: process.env.RABBIT_PASS,
    port: process.env.RABBIT_PORT,
    user: process.env.RABBIT_USER,
    host: process.env.RABBIT_HOST
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    keyPrefix: process.env.REDIS_KEY,
    db: process.env.REDIS_DB
  },

  mongoErrorCode: {
    duplicateId: 11000
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    console: process.env.LOG_ENABLE_CONSOLE === 'true'
  }

};

module.exports = config;
