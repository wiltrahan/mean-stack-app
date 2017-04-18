var express = require('express');
var router = express.Router();

//here, we get the functions from the controller file
var ctrHotels = require('../controllers/hotels.controllers.js');

//this sets /hotels as the page that will return the hotel info
//.get goes to ctrHotels which is defined above, and runs the
//hotels.GetAll function that is defined in the controller.js file.

router
  .route('/hotels')
  .get(ctrHotels.hotelsGetAll);

//to define a parameter in express, start with a colon
//the controller can now access this paramater
router
  .route('/hotels/:hotelId')
  .get(ctrHotels.hotelsGetOne);

//sets up a new route to handle post requests.
router
  .route('/hotels/new')
  .post(ctrHotels.hotelsAddOne);

module.exports = router;


