const config = require('../config/config');

class MongoDBHelper {
  /**
   * The constructor
   *
   * @param mongodbClient - MongoDB client
   * @param mongodbModel - the model you wish to operate on
   */
  constructor(mongodbClient, mongodbModel) {
    this.mongodbClient = mongodbClient;
    this.mongodbModel = mongodbModel;
  }

  /**
   * Fetches a single record from the connected MongoDB instance.
   *
   * @param params
   * @returns {Promise}
   */
  get(params) {
    return new Promise((resolve, reject) => {
      const query = this.mongodbModel.findOne(params.conditions);

      if (params.fields) { query.select(params.fields); }

      if (params.populate && params.populate.length > 0) {
        params.populate.forEach((collection) => {
          query.populate({ path: collection.path, model: collection.model });
        });
      }

      return query.exec((err, modelData) => {
        if (err) {
          return reject(MongoDBHelper.handleError(err));
        }
        return resolve(modelData);
      });
    });
  }



  getOne(param){
    return this.mongodbModel.findOne(param);
  }

  getMSISDN(param){
    return this.mongodbModel.find(param).select('msisdn -_id')
  }


  /**
   * Fetches bulk records from the connected MongoDB instance.
   *
   * @param params
   * @returns {Promise}
   */
  getBulk(params, skipParam) {
    return new Promise((resolve, reject) => {
      let query;
      let limit = Number(skipParam.limit);
      let skip = Number(skipParam.skip);

      // pagination
      if (params.fields) {
        query.select(params.fields);
      }

      if (params.sort) {
        query.sort(params.sort);
      }
      if(!limit || !skip) {
        query = this.mongodbModel.find(params)
      }

      if(limit && !skip) {
        query = this.mongodbModel.find(params).limit(limit)
      }

      if (limit && skip) {
        query = this.mongodbModel.find(params).skip(skip).limit(limit)
      }

      return query.exec((error, modelData) => {
        if (error) {
          return reject(mongodbModel.handleError(error));
        }
        return resolve(modelData);
      });
    });
  }

  /**
   * Saves data into the MongoDB instance
   *
   * @param data
   * @returns {Promise}
   */
  save(data) {
    return new Promise((resolve, reject) => {
      const mongodbSaveSchema = this.mongodbModel(data);
      return mongodbSaveSchema.save((error, result) => {
        if (error != null) {
          return reject(MongoDBHelper.handleError(error));
        }
        return resolve(result);
      });
    });
  }

  // new test
  getOne(data) {
    return new Promise((resolve, reject) => {
      this.mongodbModel.findOne(data)
        .then((data) => {
          return resolve(data);
        })
        .catch((err) => {
          return reject(MongoDBHelper.handleError(err));
        })
    })
  }
  /**
   * This closes the connection from this client to the running MongoDB database
   *
   * @returns {Promise}
   */
  close() {
    return new Promise((resolve, reject) => {
      this.mongodbClient.close();
      return resolve({
        error: false,
        msg: 'connection was successfully closed. Why So Serious, I am gone for a vacation!'
      });
    });
  }


  /**
   * Used to format the error messages returned from the MongoDB server during CRUD operations
   *
   * @param report
   * @returns {{error: boolean, message: *}}
   */
  static handleError(report) {
    return { error: true, msg: report };
  }
}

module.exports = MongoDBHelper;
