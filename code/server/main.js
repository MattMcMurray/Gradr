// our routes
var api = require('./routes/api.js');
var pages = require('./routes/index.js');

// npm modules
var express = require('express');
var app = express();
var body_parser = require('body-parser');

app.use(body_parser.urlencoded({ extended: true })); // tell node how we want to parse form data
app.use(body_parser.json()); // tell node to use json for form parsing
app.use(express.static(__dirname + '/public')); // tell express where the clientside files are

app.set('view engine', 'jade'); // tell node to use jade templating

// PORT 80 is reserved for the system; make sure you run 'sudo node main.js'
var port = process.env.PORT || 80;

app.use('/api', api.router); // tell node to use routes.js as our /api/ routes
app.use('/', pages.router); // tell node to use index.js for front facing pages

var server = app.listen(port, function() {
	console.log("App running on port " + server.address().port);
});
