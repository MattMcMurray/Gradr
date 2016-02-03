var _express = require('express');

var router = _express.Router();
var app = _express();
var User = require('../models/User.js');
var UserMatches = require('../models/UserMatches.js');
var authenticator = require("../mixins/authenticator.js");

router.get('/', function (req, res) {
	res.json({message: 'Hello world!'});
});

router.post('/NewUser', function (req, res) {
	User.createUser(getCredentials(req)).then(function(data){
		console.log('New user ' + req.body.username + ' created');
		res.json({url:"/", message: 'New user created'});
	}).catch(function(error){
		res.status(500);
		res.json(error);
	});
	
});

router.post('/ProfileUpdate', function (req, res) {
	User.createUserProfile(getProfileDate(req));
	console.log('User ' + req.body.username + ' profile updated');
	res.json({url:"/", message: 'User profile updated'});
});

router.post("/login", function(req,res) {
	
	credentials = getCredentials(req)
	
	User.getUser(credentials.username).then(function(user){

		if (user != null && authenticator.authenticate(credentials.password, user.dataValues.password)){
      
			res.json({ url: "/main", user: user });
		} else {
			res.status(500)
			res.json({message: "Oops! Something went wrong. Invalid username/password."});
		}
	});
});


// Get a random user; useful for matching process
router.get('/randomUser', function(req, res){

	User.getRandom().then(function(user) {
		if (user != null) {
			res.json({username: user.username, userID: user.id, school: user.school, firstname: user.firstname, lastname: user.lastname, helpDescription: user.helpDescription})	
		} else {
			res.json({message: "Something went wrong"});
		}
		
	});
});

router.get('/getPotentialMatches', function(req, res){
	UserMatches.getMatches(req.query.userId).then(function(ids){
		User.getUsersById(ids).then(function(users) {
			res.json({matches: users});
		});
	});
});

router.post('/likeUser', function(req, res){
	UserMatches.addUserMatch(req.body.liker_id, req.body.likee_id, true);
});


router.post('/dislikeUser', function(req, res){
	UserMatches.addUserMatch(req.body.liker_id, req.body.likee_id, false);
});

// Getting a specific user
// Specify username in GET variable
router.get('/getUser', function(req, res) {

    if (req.query.user) {
        User.getUser(req.query.user).then(function(user) {
            if (user) {
              delete user.dataValues.password; // probably not the best idea to send this over the wire
              res.json({user: user});
            } else {
              res.json({user: null});
            }
        });
    } else {
        res.sendStatus(401); // bad request; no user included in GET vars
    }
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
