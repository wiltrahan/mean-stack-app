//mongoClient is now connected to the mongodb module
//dburl is the address where the db is hosted
//27017 is the default local server for mongodb

var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017/meanhotel';

var _connection = null;

//this function opens the db, and has parameters for errors (err)
//and the database (db).  if there is no error, the db is picked up by
//_connection which is then returned from the get function
//finally, module.exports makes both open, and get available to the hotels controller.
var open = function() {
  MongoClient.connect(dburl, function(err, db) {
    if(err){
      console.log("DB connection failed");
      return;
    }
    _connection = db;
    console.log("DB connection open", db);
  });
};

var get = function() {
  return _connection;
};

module.exports = {
  open : open,
  get : get
};
