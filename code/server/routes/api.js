var _express = require('express');

var router = _express.Router();
var app = _express();
var User = require('../models/User.js')

router.get('/', function (req, res) {
	res.json({message: 'Hello world!'});
});

router.post('/NewUser', function (req, res) {
	User.createUser(req.body.username,req.body.password);
	console.log('New user ' + req.body.username + ' created');
	
	res.status(101).send('Username already exists!');
});



module.exports = {router};
