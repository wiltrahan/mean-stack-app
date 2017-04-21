var mongoose = require('mongoose');

//this is the review schema which will will reference in the hotelSchema below
//the review is owned by the parent hotel ID
//IT IS IMPORTANT THAT THE NESTED SCHEMAS ARE DEFINED BEFORE THE MAIN PARENT SCHEMA
//THIS IS SO THE REFERENCES EXIST WHEN WE BRING THEM INTO THE MAIN SCHEMA
//IN THIS CASE, REVIEWS, AND ROOMS, ARE NESTED INSIDE OF THE MAIN HOTEL SCHEMA
var reviewSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  rating : {
    type : Number,
    min : 0,
    max : 5,
    required : true
  },
  review : {
    type : String,
    required : true
  },
  createdOn : {
    type : Date,
    default : Date.now
  }

});

//room schema which will be referenced by the hotel schema below
var roomSchema = new mongoose.Schema({
  type : String,
  number : Number,
  description : String,
  photos : [String],
  price : Number
});

//here we set up (define) the new mongoose schema
//'services' is an array of strings
var hotelSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  stars : {
    type : Number,
    min : 0,
    max : 5,
    default : 0
  },
  services : [String],
  description : String,
  photos : [String],
  currency : String,
  reviews : [reviewSchema],
  rooms : [roomSchema],
  location : {
    address : String,
    //always store coordinates longitude(E/W), latitude(N/S) order
    coordinates : {
      type : [Number],
      index : 'Zdsphere'
    }
  }
});

//this sets up the model..first param is the name of the model 'Hotel'
//the second is the name of the schema, the third is the name of the mongoDB collection
//the collection name is optional. if you don't specifiy that param, it will add it as
//the pluralized version of the model name. ex Hotel, would be hotels.
//THE LAST THING WE DO HERE IS COMPILE THE MODEL WITH THE ABOVE SCHEMAS
mongoose.model('Hotel', hotelSchema, 'hotels');
