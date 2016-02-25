var _express = require('express');
var router = _express.Router();
var UserDAO = require('../data_access/UserDataAccess.js');
var UserMatchDAO = require('../data_access/UserMatchDataAccess.js');
var RatingDAO = require('../data_access/RatingDataAccess.js');


router.get("/", function(req, res) {
    res.render('../views/index', {});
});

router.get("/signup", function(req,res) {
	res.render('../views/signup', {});
});

router.get("/main", function(req, res) { 
    res.render('../views/swipe', {});
});

router.get("/profile", function(req, res) {
	res.render('../views/profile');
});


router.get("/matches", function(req, res) {
	res.render('../views/matches');
});

router.get("/matchProfile", function(req,res){


	UserDAO.getUsersById(req.query.user).then(function(users) {
		RatingDAO.getRatings(req.query.user).then(function(ratings){
			res.render("matchUserProfile", {user:users[0].dataValues, ratings: ratings});	
		}).catch(function(error){
			console.log(error);
			res.render('../views/error', {message: error});
		});
	}).catch(function(error){
		console.log(error);
		res.render('../views/error', {message: "Cannot find user "+ req.query.user});
	});
	
});

router.get("/matchList", function(req,res){
	//get all matches for current user
	//using all these matches,
	//get the matches name and shit..
	UserMatchDAO.getMatches(req.query.user).then(function(users){
		UserDAO.getUsersById(users).then(function(users){
			res.render("../views/matchList", {matches: users});
		});
	});
});

module.exports = {router};

