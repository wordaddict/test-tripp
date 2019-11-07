const bodyParser = require('body-parser');
const checkToken = require('../controllers/middleware')

module.exports.setup = function setup(server, serviceLocator) {
  const mainController = serviceLocator.get('mainController');

  // parse application/x-www-form-urlencoded
  server.use(bodyParser.urlencoded({ extended: false }))
 
  // parse application/json
  server.use(bodyParser.json())

  server.get({
    path: '/',
    name: 'app health check',
    version: '1.0.0'
  }, (req, res) => res.send('Welcome to the Test API Service'));

  server.post({
    path: '/messages',
    name: 'Login a user ',
    version: '1.0.0'
  }, checkToken, (req, res) => mainController.sendMessages(req, res));

  // create customer
  server.post({
    path: '/customer',
    name: 'creates a new customer',
    version: '1.0.0'
  }, (req, res) => mainController.createANewConsumer(req, res));

  // log customers in
  server.post({
    path: '/customer/login',
    name: 'creates a new customer',
    version: '1.0.0'
  }, (req, res) => mainController.logCustomersIn(req, res));

  //Add a new contact
  server.post({
    path: '/contact',
    name: 'Add a new contact',
    version: '1.0.0'
  }, (req, res) => mainController.addContacts(req, res));


};
