/*jshint esversion: 6 */

const mongoose = require('mongoose');

// Contact Schema
const contactSchema = mongoose.Schema({
      // _id: {
      //
      // },
      first_name: {
            type: String,
            default: ""
      },
      last_name: {
            type: String,
            default: ""
      },
      email_address: {
            type: String,
            default: ""
      },
      phone_number:  {
            type: String,
            default: ""
      },
      location: {
            type: String,
            default: ""
      },
      date_entered:{ // aka last message date
            type: Date,
            default: Date.now
      }
      // s: { //msg_status
      //       type: Number,
      //       default: 200
      // },
      // p: { //replied
      //       type: Boolean,
      //       default: true
      // },
      // r:  { //left_review
      //       type: Boolean,
      //       default: false
      // },
      // m: Array, //messages
      // l: { //last_msg
      //       type: String,
      //       default: ""
      // },
      // v:  { //sent_vc
      //       type: Boolean,
      //       default: false
      // }
});

const Contact = module.exports = mongoose.model('Contact', contactSchema);

// Get Contacts
module.exports.getContacts = function(callback, limit) {
      Contact.find(callback).limit(limit);
}

// Get Contacts
// module.exports.getContacts = function(callback, limit, page) {
//       Contact.find(callback).limit(3).skip(990).exec();
      //console.log('test');
// }

// Get single contact
module.exports.getContactById = function(id, callback) {
      Contact.findById(id, callback);
}

// Add a contact
module.exports.addContact = function(contact, callback) {
      Contact.create(contact, callback);
}

// Update a contact
module.exports.updateContact = function(id, contact, options, callback) {
      var query = {_id: id};
      var update = {
            first_name: contact.first_name,
            last_name: contact.last_name,
            email_address: contact.email_address,
            location: contact.location,
            phone_number: contact.phone_number
      }
      Contact.findOneAndUpdate(query, update, options, callback);
}

// Save incoming message
// module.exports.saveMessage = function(id, contact, options, callback) {
//       var query = {_id: id};
//       var update = {
//             first_name: contact.first_name,
//             last_name: contact.last_name,
//             email_address: contact.email_address,
//             location: contact.location,
//             phone_number: contact.phone_number
//       }
//       Contact.findOneAndUpdate(query, update, options, callback);
// }

// Delete a contact
module.exports.deleteContact = function(id, callback) {
      var query = {_id: id};
      Contact.remove(query, callback);
}
