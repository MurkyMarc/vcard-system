/*jshint esversion: 6 */

const config = require('./config');

// Twilio Credentials
const accountSid = config.twillio.accountSid;
const authToken = config.twillio.authToken;

// Phone Numbers
const myPhone = config.phone.myPhone;
const appPhone = config.phone.appPhone;

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
    to: myPhone,
    from: appPhone,
    body: 'twilio test message',
  })
  .then(message => console.log(message.sid));
