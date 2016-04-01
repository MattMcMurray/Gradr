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
	UserMatchDAO.getMatches(req.query.user).then(function(users){
		UserDAO.getUsersById(users).then(function(users){
			res.render('../views/matches', { matches: users, isRejections: false });
		});
	});
});

router.get("/rejections", function(req, res) {
	console.log("Session: " + req.session);
	UserMatchDAO.getRejections(req.query.user).then(function(users) {
		UserDAO.getUsersById(users).then(function(users) {
			res.render('../views/matches', {matches: users, isRejections: true});
		});
	});
});

router.get("/leaders", function(req,res) {
	UserMatchDAO.getLeaders().then(function(leaders) {
		var ids = [];
		var results = [];

		for (var i = 0; i < leaders.rows.length; i++) {
			ids.push(leaders.rows[i].likee_id);
		}
		console.log(ids);
		UserDAO.getUsersById(ids).then(function(users) {
			if (leaders.error || users.error) {
			res.status(500)
			}

			for(var i = 0; i < leaders.rows.length; i ++) {
				
				if(users[i]) results.push({count: leaders.count[i].count, user: users[i]})
				
			}

			results.sort(function(a,b) { return parseFloat(b.count) - parseFloat(a.count) } );



			res.render('leaderBoard', {leaders: results});
		});
		
	});
})

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

module.exports = {router};

