var _express = require('express');

var router = _express.Router();
var app = _express();
var User = require('../models/User.js')

router.get('/', function (req, res) {
	res.json({message: 'Hello world!'});
});

router.post('/NewUser', function (req, res) {
	console.log(req);
	User.createUser(req.body.username,req.body.password);
	console.log('New user ' + req.body.username + ' created');
	res.json({message: 'New user created'});
});



module.exports = {router};
