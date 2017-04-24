//this file sets up our mongoose connection
var mongoose = require('mongoose');
var dburl = 'mongodb://localhost:27017/meanhotel';

mongoose.connect(dburl);

mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + dburl);
});

mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected');
});
mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
});

//this listens for events. SIGINT is fired when you do cntrl-c to terminate
//the application. when that happens, the callback function runs, showing the message
//then exiting with process.exit(0).
process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log("Mongoose disconnected through app termination");
    process.exit(0);
  });
});
//this one works with heroku..only difference is SIGTERM
process.on('SIGTERM', function() {
  mongoose.connection.close(function() {
    console.log("Mongoose disconnected through app termination (SIGTERM)");
    process.exit(0);
  });
});

process.once('SIGUSR2', function() {
  mongoose.connection.close(function() {
    console.log("Mongoose disconnected through app termination (SIGUSR2)");
    process.kill(process.pid, 'SIGUSR2');
  });
});

//bring in the schema and models
require('./hotels.model');
require('./users.model');
