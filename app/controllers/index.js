const Response = require('../lib/response_manager');
const HttpStatus = require('../constants/httpStatus');
const Queue = require('../controllers/queue');
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const consumeQueue = require('../consumer');

class MainController {
  /**
   * Class Constructor
   * @param logger - winston logger
   * @param mainService
   */
  constructor(logger, mainService) {
    this.logger = logger;
    this.mainService = mainService;
  }

  createANewConsumer(req, res){
    let msisdn;
    let firstname;
    let lastname;
  
    if (req.body.msisdn) {
      msisdn = req.body.msisdn;
    }

    if (req.body.firstname) {
      firstname = req.body.firstname;
    }

    if (req.body.lastname) {
      lastname = req.body.lastname;
    }

    // check if required parameters are passed
    if (!msisdn) {
      return Response.failure(res, { message: 'Error!! pls provide msisdn field' }, HttpStatus.BadRequest);
    };

    const param = {
      msisdn,
      firstname,
      lastname,
      userId: uuid()
    }

    return this.mainService.createCustomer(param)
      .then((data) => {
        return Response.success(res, {
          message: 'Customer created successfully',
          response: {
            userId: data.userId
          },
        }, HttpStatus.CREATED)
      })
      .catch((err) => {
        let formattedError = err.msg
        formattedError = JSON.stringify(formattedError);
        return Response.failure(res, {
          message: `Something went wrong,  ${formattedError}`
          }, HttpStatus.BadRequest)
      })
  }

  logCustomersIn(req, res){
    let msisdn;
  
    if (req.body.msisdn) {
      msisdn = req.body.msisdn;
    }

    // check if required parameters are passed
    if (!msisdn) {
      return Response.failure(res, { message: 'Error!! pls provide msisdn field' }, HttpStatus.BadRequest);
    };

    const param = {
      msisdn,
    };

    let userData;
    // check if user already exist in cache
    this.mainService.getUserFromRedis(msisdn)
      .then(async(data) => {
      
        if(data === null){
          try {
            userData = await this.mainService.findUser(param);
            if(userData === null) {
              return Response.failure(res, {
                message: 'msisdn doesnt exist, please create an account'
              }, HttpStatus.BadRequest)
            }
              // If data doesn't exist in redis, we would save it on redis
            const { msisdn } = userData;
            const dataSavedInRedis = await this.mainService.saveUserOnRedis(msisdn, userData);
            console.log('Data saved in redis successfully', dataSavedInRedis)
          } catch (err){
            console.log('the error', err)
            return Response.failure(res, {
              message: 'Internal server Error',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
          }
          
        } else {
          userData = data;
        };
        const msisdn = {userData}
        return jwt.sign({msisdn}, config.secret, { expiresIn: '12h' }, (err, token) => {
          if(err === null){
            return Response.success(res, {
              message: 'Customer logged in successfully',
              response: {
                userId: userData.userId,
                msisdn: userData.msisdn,
                token: token
              },
            }, HttpStatus.OK)
          } else {
              return Response.failure(res, {
                message: 'Internal server Error',
              }, HttpStatus.INTERNAL_SERVER_ERROR);
          }
        })
      })
      .catch((err) => {
        console.log('error from redis', err)
      })

  };

  // add new contact
  addContacts(req, res){
    this.logger.info('Add contacts');
    let msisdn;
    let contact_list;
  
    if (req.body.msisdn) {
      msisdn = req.body.msisdn;
    }

    if (req.body.contact_list) {
      contact_list = req.body.contact_list;
    }

    // check if required parameters are passed
    if (!contact_list || !msisdn) {
      return Response.failure(res, { message: 'Error!! pls provide msisdn and contact_list fields' }, HttpStatus.BadRequest);
    };

    const param = {
      contact_list,
      msisdn
    }

    return this.mainService.addNewContacts(param)
      .then((data) => {
        return Response.success(res, {
          message: 'contact added successfully',
        }, HttpStatus.CREATED)
      })
      .catch((err) => {
        let formattedError = err.msg
        formattedError = JSON.stringify(formattedError);
        return Response.failure(res, {
          message: `Something went wrong, ${formattedError}`
          }, HttpStatus.BadRequest)
      })

  }

  /**
   * Send messages
   * @param req
   * @param res
   * @methodVerb POST
   */
  sendMessages(req, res) {
    this.logger.info('Send new message');
    let message;
    let task_id;
    let contact_list;
  
    if (req.body.message) {
      message = req.body.message;
    }

    if (req.body.task_id) {
      task_id = req.body.task_id;
    }

    if (req.body.contact_list) {
      contact_list = req.body.contact_list;
    }
    // check if required parameters are passed
    if (!contact_list || !task_id || !message) {
      return Response.failure(res, { message: 'Error!! pls provide task_id, message and contact_list fields' }, HttpStatus.BadRequest);
    }

    const param = {
      contact_list,
      message,
      task_id
    }

    this.mainService.pushToQueue(param, 'messages')
      .then((data) => {
        return Response.success(res, {
          message: 'message pushed successfully'
        }, HttpStatus.OK)
      })
      .catch(() => {
        return Response.failure(res, {
          message: 'Internal server Error',
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      })
  }
  
}


module.exports = MainController;
