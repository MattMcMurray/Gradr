var _express = require('express');

var router = _express.Router();
var app = _express();
var User = require('../models/User.js')
var authenticator = require("../mixins/authenticator.js")

router.get('/', function (req, res) {
	res.json({message: 'Hello world!'});
});

router.post('/NewUser', function (req, res) {
	User.createUser(getCredentials(req));
	console.log('New user ' + req.body.username + ' created');
	res.json({url:"/", message: 'New user created'});
});

router.post('/ProfileUpdate', function (req, res) {
	User.createUserProfile(getProfileDate(req));
	console.log('User ' + req.body.username + ' profile updated');
	res.json({url:"/", message: 'User profile updated'});
});

router.get('/user', function(req, res) {
	console.log(req.query.username);
	var username = req.query.username;
	User.getUser(username).then(function(user) {
		if (user != null) {
			res.json({firstname: user.firstname, lastname: user.lastname, country: user.country, 
				courses: user.courses, city: user.city, school: user.school, generalDescription: user.generalDescription, 
				helpDescription: user.helpDescription, dateOfBirth: user.dateOfBirth});
		}
		else {
			res.json({message: "Something went wrong"});
		}
	});
});

router.post("/login", function(req,res) {
	
	credentials = getCredentials(req)
	
	User.getUser(credentials.username).then(function(user){

		if (user != null && authenticator.authenticate(credentials.password, user.dataValues.password)){
      
			res.json({
        url: "/main",
        user: user
       });
		} else {
			res.status(500)
			res.json({message: "Oops! Something went wrong. Invalid username/password."});
		}
	});
});


router.get('/randomUser', function(req, res){

	User.getRandom().then(function(user) {
		if (user != null) {
			res.json({username: user.username, school: user.school})	
		} else {
			res.json({message: "Something went wrong"});
		}
		
	});
});

function getCredentials(req){
	return {username: req.body.username, password: req.body.password};
}

function getProfileDate(req) {
	return {username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, 
		address: req.body.address, city: req.body.city, country: req.body.country, school: req.body.school, 
		courses: req.body.courses, generalDescription: req.body.generalDescription, helpDescription: req.body.helpDescription, 
		dateOfBirth: req.body.dateOfBirth};
}





module.exports = {router};
