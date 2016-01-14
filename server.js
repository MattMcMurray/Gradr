// server.js

/////////////////
// BASIC SETUP //
/////////////////

// import and init packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// config body parser; allows gathering data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; 

////////////////////
// ROUTES FOR API //
////////////////////
var router = express.Router();

// test api route
router.get('/', function (req, res) {
	res.json({ message: 'Welcome to API'});
});

// more routes for API go here

// Register routes
app.use('/api', router);

// Start the server
app.listen(port);
console.log('App running on port ' + port);