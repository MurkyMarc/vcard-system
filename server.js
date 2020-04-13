/*jshint esversion: 6 */

// Variables
const port = config.port.production || 80;
const accountSid = config.twillio.accountSid;
const authToken = config.twillio.authToken;

const config = require('./config');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const http = require('http');
const morgan = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const client = require('twilio')(accountSid, authToken);
const nodemailer = require('nodemailer');
const cors = require('cors');
const Contact = require('./public/models/contact');

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: config.key.secret, saveUninitialized: true, resave: true}));

// Set Static Path
app.use(express.static(__dirname + '/public'));

// Connect to mongoose
mongoose.connect("mongodb://"+ config.db.user +":"+ config.db.pass +"@localhost:"+ config.db.port +"/vcard-contacts");

const db = mongoose.connection;

// Email credentials
const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
            user: config.email.business1,
            pass: config.email.business1pass
      }
});

////////////
///ROUTES///
////////////

// Base Route
app.get('/', function(req, res) {
      res.send('/');
      //console.log(req.cookies);
      //console.log('============');
      //console.log(req.session);
});

app.get('/send', function(req, res) {
      res.send('/send.html');
      //console.log(req.cookies);
      //console.log('============');
      //console.log(req.session);
});

app.get('/api/vcards/1', function(req, res) {
      res.download( __dirname + '/public/vcards/1.vcf');
});

app.get('/api/vcards/2', function(req, res) {
      res.download( __dirname + '/public/vcards/2.vcf');
});

// Handle GET Request for the entire contact list
app.get('/api/contacts', function(req, res) {
      Contact.getContacts(function(err, contacts){
            if(err) {
                  callback(err);
            }
            res.json(contacts);
      });
});

// Handle GET request for single contact
app.get('/api/contacts/:_id', function(req, res) {
      Contact.getContactById(req.params._id, function(err, contact){
            if(err) {
                  throw err;
            }
            callback(res.json(contact));
      });
});

// Handle POST request to the contact list
app.post('/api/contacts', function(req, res) {
      let contact = req.body;
      Contact.addContact(contact, function(err, contact){
            if(err) {
                  throw err;
            }
            res.json(contact);
      });
});

// Handle PUT request to the contact list
app.put('/api/contacts/:_id', function(req, res) {
      let id = req.params._id;
      let contact = req.body;
      Contact.updateContact(id, contact, {}, function(err, contact){
            if(err) {
                  throw err;
            }
            res.json(contact);
      });
});

app.get('/incoming', function(req, res) {
      res.send('/incoming.html');
      //console.log(req.cookies);
      //console.log('============');
      //console.log(req.session);
});

// Save redirected message from Twilio
app.post('/api/incoming', function(req, res) {
      let message = req.body;
      //console.log(message.From);
});

// Handle DELETE requests to the contact list
app.delete('/api/contacts/:_id', function(req, res) {
      let id = req.params._id;
      Contact.deleteContact(id, function(err, contact){
            if(err) {
                  throw err;
            }
            res.json(contact);
      });
});

function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
}

// Handle messages to Twilio
app.get('/twiml', function(req, res) {

      let firstname = capitalizeFirstLetter(req.query.first_name.toString().toLowerCase());
      let lastname = capitalizeFirstLetter(req.query.last_name.toString().toLowerCase());
      let email = req.query.email_address;
      let number = '+1' + req.query.phone_number.toString();
      let location_string = req.query.location.toString();
      let msg_check = req.query.msg_check;
      let custom_msg = req.query.custom_msg.toString();
      let email_string = email.toString();
      let valid_email = false;
      let valid_phone = false;
      let email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      let phone_regex = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
      let vcard;
      let msg_body = '';
      let email_body = '';

      if (email_regex.test(email_string)) {
            valid_email = true;
      }

      if (phone_regex.test(req.query.phone_number.toString())) {
            valid_phone = true;
      }

      switch(location_string) {
            case 'location1':
                  loc = 'Business 1';
                  address = 'Address 1';
                  vcard = 'vcardUrl1';
                  msg_body = firstname + ', message test.';
                  email_body = firstname + ', email test.';
                  break;
            case 'location2':
                  loc = 'Business 2';
                  address = 'Address 2';
                  vcard = 'vcardUrl2';
                  msg_body = firstname + ', message test.';
                  email_body = firstname + ', email test.';
                  break;
      }

      if (msg_check == 'yes') {
            msg_body = custom_msg;
            email_body = custom_msg;
      }

      if(valid_phone) {
            client.messages.create({
                  to: number,
                  from: config.phone.appNumber,
                  body: msg_body,
                  mediaUrl: vcard,
            }, function(err, data) {
                  console.log(err);
            });
      }

      if(valid_email) {
            var mailOptions = {
                  from: config.email.business,
                  to: email_string,
                  subject: "Subject Line",
                  text: email_body
            };
            transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                        console.log(error);
                  } else {
                        console.log('Email sent: ' + info.response);
                  }
            });
      }
      res.end();
});

// Start server
http.createServer(app).listen(port, () => {
      console.log('Express server listening on port '+ port);
});
