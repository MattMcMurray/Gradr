var api = require('./routes/routes.js');
var express = require('express');
var app = express();
var body_parser = require('body-parser');

app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());

var port = process.env.PORT || 8080;

app.use('/api', api.router);

var server = app.listen(port, function() {
	console.log("App running on port " + server.address().port);
});