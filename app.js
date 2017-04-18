require('./api/data/dbconnection.js').open();
//requires the express module
var express = require('express');
//designates the app variable to be an express app
var app = express();
//this is a native node module called path that lets you work out the actual
//path to the file you want to use.
var path = require('path');



//sets up the body-parser middlewear to handle any form post requests
var bodyParser = require('body-parser');

//gives access to the routes file
var routes = require('./api/routes');

//sets the port to be 3000. doing it this way makes it easier to change
//later on, if neccesary
app.set('port', 3000);

//this creates the middlewear we are going to use.
//the middlewear sits between the request and the response. the run in the order
//that they are placed in the code.
//get us the requested methods, and urls and logs them to the terminal
//the order of the middlewear is important because it runs in order.
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});

//this method gets the request for a route, it will then check in the public folder
//if it finds a match, it will deliver the file directly to the browser w/out the
//need to define new routes. using this allows us to get rid of the commented out
//path to the homepage below. now it looks for static routes that starts with the public folder giving you access to the html, CSS, jquery, images, etc.
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({ extended : false }));

//looks in the routes folder, and sets api as the beginning of the path
app.use('/api', routes);


//this will set thie homepage of the app to be localhost:3000
//req, is shorthand for REQUEST, RES is shorthand for RESPONSE
//these are commonly used params that you will see
//path.join takes the folder name as a string, then the file name as a string. the common way to use path.join is to have two under scores then dirname, the folder, the file __dirname
//now index.html is set as the homepage.
// app.get('/', function(req, res) {
//   console.log('get IT');
//   res
//     .status(200)
//     .sendFile(path.join(__dirname, 'public', 'index.html'));
// });



//this uses the path module from above to set /file to the file we are using
//at 3000/file, you'll see the complete file we are working on in the browser
//one use case for this is to send the html page to the browser
// app.get('/file', function(req, res) {
//   console.log('GET the file');
//   res
//     .status(200)
//     .sendFile(path.join(__dirname, 'app.js'));
// });

//this allows us to access the paramaters in the server object
//here, the port variable is set to the server address, then printed
//out to the console.
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log("Shit happens on port " + port);
});
