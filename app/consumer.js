// const Queue = require('./controllers/queue');
const MainServices = require('../app/services/index');

const consumeQueue = (data) => {
    return new Promise((resolve, reject) => {
        resolve(data);
        const { contact_list, message, task_id } = data;
        return new MainServices().getContactsWithContactList({contact_list})
            .then((data) => {
                const formattedData = formatMSISDN(data)
                const params = {
                    message,
                    task_id,
                    msisdns: formattedData
                };
                return new MainServices().saveMessagesInDB(params)
                    .then((data) => {
                        console.log('Messages saved successfully in the DB')
                    })
                    .catch((err) => {
                        console.log('unable to save message');
                        return;
                    })
               
            })
            .catch(() => {
                return;
            })
        
    })
};

const formatMSISDN = (array) => {
    let finalArray = [];
    for (let msisdn of array){
        finalArray.push(msisdn.msisdn)
    };
    return finalArray;
}

module.exports = consumeQueue;
