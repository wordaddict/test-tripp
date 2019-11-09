const serviceLocator = require('../app/config/di');

const rabbitMQClient = serviceLocator.get('rabbitmq');
const mainService = serviceLocator.get('mainService');

rabbitMQClient.then(connection => connection.createChannel())
.then((channel) => {
  channel.prefetch(1);
  channel.assertQueue('messages', { durable: true, noAck: false })
    .then(ok => channel.consume('messages', (messageObject) => {
        console.log('consuming...', ok);
      if (messageObject !== null) {
        let data = messageObject.content.toString();
        console.log('Message to consume', data)
        data = JSON.parse(data);
        const { contact_list, message, task_id } = data;
        mainService.getContactsWithContactList({contact_list})
            .then((data) => {
                console.log('All contacts', data)
                if(data.length === 0){
                    return;
                }
                const formattedData = formatMSISDN(data)
                const params = {
                    message,
                    task_id,
                    msisdns: formattedData
                };
                mainService.saveMessagesInDB(params)
                    .then((data) => {
                        console.log('Messages saved successfully in the DB')
                    })
                    .catch((err) => {
                        console.log('unable to save message', err);
                    })
               
            })
            .catch((err) => {
                console.log('Error from getting contact list', err);
            })
      }
    }, {noAck: true}));
});

const formatMSISDN = (array) => {
    let finalArray = [];
    for (let msisdn of array){
        finalArray.push(msisdn.msisdn)
    };
    return finalArray;
}