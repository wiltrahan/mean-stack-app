//this exports the controller function and makes it avail to index.js

//using .json sends the json file that is included in requested in the json method
//res sets the status code, and the .json that will be sent

//in node .json files can be required as we are doing here
//we then pass this variable to the .json method
//dbconn connects to the database at said location
var dbconn = require('../data/dbconnection.js');
var ObjectId = require('mongodb').ObjectId; //here we get the object id helper from the mongo module(converts bson to json)
var hotelData = require('../data/hotel-data.json');

module.exports.hotelsGetAll = function(req, res) {
  //here dbconn.get() gets all info from the db
  var db = dbconn.get();

  //here we are saying use the current db connection and use the collection
  //called hotels
    var collection = db.collection('hotels');

    var offset = 0;
    var count = 5;
    //here we are checking to see if the query property existing on the request object
    //if it does, we check to see if the query prop has its own property of offset
    //if they both do, we set the offset value of the controller
    //parseInt makes it a number.
    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }

    if (req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }

  //here we chain the find and toArray methods onto hotels, like we do in the mongo shell
  //toArray accepts a callback function for when its finished
  //skip and limit are two mongo methods. skip will be how many from the beginning
  //gets returned, and limit is how many will be returned in total.
    collection
        .find()
        .skip(offset)
        .limit(count)
        .toArray(function(err, docs) {
            console.log("Found hotels", docs);
            res
                .status(200)
                .json(docs);
        });
};

//taking the info from the json file and sending the info to the browswer
//based on what id is put into the url parameter
//example: api/hotels/1  will get you the first hotel in the json file
module.exports.hotelsGetOne = function(req, res) {
    var db = dbconn.get();
    var collection = db.collection('hotels');

    var hotelId = req.params.hotelId;
    console.log('Get the hotelId', hotelId);
//here we pass the name/val pair of _id/ObjectId to the object param in the findOne method
//it allows us to return the single hotel that is being searched for based on its unique ID
    collection
        .findOne({
          _id : ObjectId(hotelId)
        }, function(err, doc){
            res
                .status(200)
                .json(doc);
        });
};
//this allows the function to be exported to the index.js file
//and the response will contain the requested body of the json file.
//if you don't have a form already made, it can be tested with the postman extension
module.exports.hotelsAddOne = function(req, res) {
    var db = dbconn.get();
    var collection = db.collection('hotels');
    var newHotel;

    console.log("POST new hotel");
    //if these all exist then this runs, if NOT, it returns the 400 status + err message
    if (req.body && req.body.name && req.body.stars) {
        newHotel = req.body;
        newHotel.stars = parseInt(req.body.stars, 10);
        collection.insertOne(newHotel, function(err, response) {
            console.log(response);
            console.log(response.ops);
            res
                .status(201)
                .json(response.ops);
        });
    } else {
        console.log("Data missing from body");
        res
            .status(400)
            .json({message : "Required data missing from body"});
    }

};
