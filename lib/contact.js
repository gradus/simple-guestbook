resourceful = require('resourceful');

//comment for in memory store
resourceful.use('couchdb', {database: 'guestbook'} );

var pin = require('./linchpin')

var Contact = resourceful.define('contact', function () {
  this.string('first_name').required(true);
  this.string('last_name').required(true);
  this.string('email').required(true);
  this.string('phone').required(true);
});

module.exports = User
