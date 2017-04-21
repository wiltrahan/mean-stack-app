var express = require('express');
var router = express.Router();

//here, we get the functions from the controller file
var ctrHotels = require('../controllers/hotels.controllers.js');
//from the reviews controller
var ctrReviews = require('../controllers/reviews.controllers.js');

//this sets /hotels as the page that will return the hotel info
//.get goes to ctrHotels which is defined above, and runs the
//hotels.GetAll function that is defined in the controller.js file.

router
  .route('/hotels')
  .get(ctrHotels.hotelsGetAll)
  .post(ctrHotels.hotelsAddOne);

//to define a parameter in express, start with a colon
//the controller can now access this paramater
router
  .route('/hotels/:hotelId')
  .get(ctrHotels.hotelsGetOne)
  .put(ctrHotels.hotelsUpdateOne)
  .delete(ctrHotels.hotelsDeleteOne);

//reviews routes
router
  .route('/hotels/:hotelId/reviews')
  .get(ctrReviews.reviewsGetAll)
  .post(ctrReviews.reviewsAddOne);


router
  .route('/hotels/:hotelId/reviews/:reviewId')
  .get(ctrReviews.reviewsGetOne)
  .put(ctrReviews.reviewsUpdateOne)
  .delete(ctrReviews.reviewsDeleteOne);

module.exports = router;


