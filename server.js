// server.js

/////////////////
// BASIC SETUP //
/////////////////

// import and init packages and modules
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
require('./database/databaseTest.js')

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

router.get('/student', function(req, res) {
	console.log(req.query);
	Student.findAll({
		where: req.query
	}).then(function(student){
		res.json(student)
	});
});

// Register routes
app.use('/api', router);

// Start the server
var server = app.listen(port, function() {
	console.log('App running on localhost port %s', server.address().port);
});





