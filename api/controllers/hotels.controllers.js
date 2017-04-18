//this exports the controller function and makes it avail to index.js

//using .json sends the json file that is included in requested in the json method
//res sets the status code, and the .json that will be sent

//in node .json files can be required as we are doing here
//we then pass this variable to the .json method
var dbconn = require('../data/dbconnection.js');
var hotelData = require('../data/hotel-data.json');

module.exports.hotelsGetAll = function(req, res) {

  var db = dbconn.get();

  console.log("db", db);

  console.log('GET the hotels');
  console.log(req.query);

  var offset = 0;
  var count = 5;
//here we are checking to see if the query property existing on the request object
//if it does, we check to see if the query prop has its own property of offset
//if they both do, we set the offset value of the controller
//parseInt makes it a number.
  if (req.query && req.query.offset) {
    offset = parseInt(req.query.offset, 10);
  }
//same is done here, just with the count
  if (req.query && req.query.count) {
    count = parseInt(req.query.count, 10);
  }
//here we are getting the hotel data starting with the 0th place hotel
//and going up to the 5th hotel, or the one in the 4th postion of the data array.
//offset is the start of the slice, offset+count is the end of the slice
  var returnData = hotelData.slice(offset, offset+count);

  res
    .status(200)
    .json( returnData );
};

//taking the info from the json file and sending the info to the browswer
//based on what id is put into the url parameter
//example: api/hotels/1  will get you the first hotel in the json file
module.exports.hotelsGetOne = function(req, res) {
  var hotelId = req.params.hotelId;
  var thisHotel = hotelData[hotelId];
  console.log('Get the hotelId', hotelId);
  res
    .status(200)
    .json( thisHotel );
}
//this allows the function to be exported to the index.js file
//and the response will contain the requested body of the json file.
//if you don't have a form already made, it can be tested with the postman extension
module.exports.hotelsAddOne = function(req, res) {
  console.log("POST new hotel");
  console.log(req.body);
  res
    .status(200)
    .json(req.body);
}
