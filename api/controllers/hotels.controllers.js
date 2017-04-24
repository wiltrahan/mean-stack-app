//this exports the controller function and makes it avail to index.js

//using .json sends the json file that is included in requested in the json method
//res sets the status code, and the .json that will be sent

//in node .json files can be required as we are doing here
//we then pass this variable to the .json method
//dbconn connects to the database at said location
// var dbconn = require('../data/dbconnection.js');
// var ObjectId = require('mongodb').ObjectId; //here we get the object id helper from the mongo module(converts bson to json)
// var hotelData = require('../data/hotel-data.json');
// Now we have mongoose in our file, and the model linked to the variable hotel
var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

var runGeoQuery = function(req, res) {

  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);

  if (isNaN(lng) || isNaN(lat)) {
    res
      .status(400)
      .json({
        "message" : "If supplied in querystring, lng and lat must both be numbers"
      });
    return;
  }

  // A geoJSON point
  var point = {
    type : "Point",
    coordinates : [lng, lat]
  };

  var geoOptions = {
    spherical : true,
    maxDistance : 2000,
    num : 5
  };

  Hotel
    .geoNear(point, geoOptions, function(err, results, stats) {
      console.log('Geo Results', results);
      console.log('Geo stats', stats);
      if (err) {
        console.log("Error finding hotels");
        res
          .status(500)
          .json(err);
      } else {
        res
          .status(200)
          .json(results);
      }
    });
};

module.exports.hotelsGetAll = function(req, res) {
  //here dbconn.get() gets all info from the db
  // var db = dbconn.get();
  console.log('Requested by ' + req.user);
  //here we are saying use the current db connection and use the collection
  //called hotels
    // var collection = db.collection('hotels');

    var offset = 0;
    var count = 5;
    var maxCount = 10;

    if(req.query && req.query.lat && req.query.lng) {
      runGeoQuery(req, res);
      return;
    }
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

    //error capturing
    if(isNaN(offset) || isNaN(count)) {
      res
        .status(400)
        .json({
          "message" : "If supplied in querystring, count and offset should be numbers"
        });
      return;
    }
    if(count > maxCount) {
      res
        .status(400)
        .json({
          "message" : "Count limit of " + maxCount + " exceeded"
        });
        return;
    }

    //find a hotel, skip the offset amount, and limit it to the count specified
    //log the amount of hotels returned, and spit out the json.
    Hotel
      .find()
      .skip(offset)
      .limit(count)
      .exec(function(err, hotels) {
        if(err){
          console.log("Error finding hotels");
          res
            .status(500)
            .json(err);
        } else {
          console.log("Found hotels", hotels.length);
          res
            .json(hotels);
        }
      });

  //here we chain the find and toArray methods onto hotels, like we do in the mongo shell
  //toArray accepts a callback function for when its finished
  //skip and limit are two mongo methods. skip will be how many from the beginning
  //gets returned, and limit is how many will be returned in total.
    // collection
    //     .find()
    //     .skip(offset)
    //     .limit(count)
    //     .toArray(function(err, docs) {
    //         console.log("Found hotels", docs);
    //         res
    //             .status(200)
    //             .json(docs);
    //     });
};

//taking the info from the json file and sending the info to the browswer
//based on what id is put into the url parameter
//example: api/hotels/1  will get you the first hotel in the json file
module.exports.hotelsGetOne = function(req, res) {
    // var db = dbconn.get();
    // var collection = db.collection('hotels');


    var hotelId = req.params.hotelId;
    console.log('Get the hotelId', hotelId);
//here we pass the name/val pair of _id/ObjectId to the object param in the findOne method
//it allows us to return the single hotel that is being searched for based on its unique ID
    Hotel
        .findById(hotelId) //mongoose helper method
        .exec(function(err, doc) {
          var response = {
            status : 200,
            message : doc
          };
          if(err){
            console.log("Error finding hotel");
            response.status = 500;
            response.message = err;
          }
          else if(!doc) {
              response.status = 404;
              response.message =  {
                      "message" : "Hotel ID not found"
                    };
          }
          res
            .status(response.status)
            .json(response.message);
      });
};

//helper function

var _splitArray = function(input) {
  var output;
  if(input && input.length > 0) {
    output = input.split(';');
  } else {
    output = [];
  }
  return output;
}


//this allows the function to be exported to the index.js file
//and the response will contain the requested body of the json file.
//if you don't have a form already made, it can be tested with the postman extension
module.exports.hotelsAddOne = function(req, res) {

    //start with the model
    Hotel
      .create({
        name : req.body.name,
        description : req.body.description,
        stars : parseInt(req.body.stars, 10),
        services : _splitArray(req.body.services),
        photos : _splitArray(req.body.photos),
        currency : req.body.currency,
        location : {
          address : req.body.address,
          coordinates : [
            parseFloat(req.body.lng),
            parseFloat(req.body.lat)
          ]
        }
      }, function(err, hotel) {
        if(err) {
          console.log("Error creating hotel");
          res
            .status(400)
            .json(err);
        } else {
          console.log("Hotel created", hotel);
          res
            .status(201)
            .json(hotel);
        }
      });

};

module.exports.hotelsUpdateOne = function(req, res) {
  var hotelId = req.params.hotelId;
  console.log('Get the hotelId', hotelId);

    Hotel
        .findById(hotelId)
        .select("-reviews -rooms") //excluds reviews/rooms
        .exec(function(err, doc) {
          var response = {
            status : 200,
            message : doc
          };
          if(err){
            console.log("Error finding hotel");
            response.status = 500;
            response.message = err;
          }
          else if(!doc) {
              response.status = 404;
              response.message =  {
                      "message" : "Hotel ID not found"
                    };
          }
          if(response.status !== 200) {
            res
              .status(response.status)
              .json(response.message);
          } else {
            doc.name = req.body.name;
            doc.description = req.body.description,
            doc.stars = parseInt(req.body.stars, 10),
            doc.services = _splitArray(req.body.services),
            doc.photos = _splitArray(req.body.photos),
            doc.currency = req.body.currency,
            doc.location = {
              address : req.body.address,
              coordinates : [
                parseFloat(req.body.lng),
                parseFloat(req.body.lat)
              ]
            };

            doc.save(function(err, hotelUpdated) {
              if(err){
                res
                  .status(500)
                  .json(err);
              } else {
                res
                  .status(204)
                  .json();
              }
            });
          }
      });
};

module.exports.hotelsDeleteOne = function(req, res) {
  var hotelId = req.params.hotelId;

  Hotel
    .findByIdAndRemove(hotelId)
    .exec(function(err, location) {
      if (err) {
        res
          .status(404)
          .json(err);
      } else {
        console.log("Hotel deleted, id:", hotelId);
        res
          .status(204)
          .json();
      }
    });
};
