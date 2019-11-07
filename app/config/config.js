const app_name = 'Test project MS';

const config = {
  app_name,
  server: {
    url: process.env.APP_URL,
    port: process.env.APP_PORT
  },
  secret: 'ilovefood',
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

  mongoErrorCode: {
    duplicateId: 11000
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    console: process.env.LOG_ENABLE_CONSOLE === 'true'
  }

};

module.exports = config;
