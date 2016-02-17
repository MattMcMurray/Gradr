var _express = require('express');

var router = _express.Router();
var app = _express();
var UserDAO = require('../data_access/UserDataAccess.js');
var UserMatchDAO = require('../data_access/UserMatchDataAccess.js');
var RatingDAO = require('../data_access/RatingDataAccess.js');
var authenticator = require("../mixins/authenticator.js");

initializeDAOs('db');

router.get('/', function (req, res) {
	res.json({message: 'Hello world!'});
});

router.post('/NewUser', function (req, res) {
    if (req.body.password === req.body.confirmPassword) {
        UserDAO.createUser(getCredentials(req)).then(function(data) {
            console.log('New user ' + req.body.username + ' created');
            res.json({url:"/", message: 'New user created'});
        }).catch(function(error) {
            res.status(500);
            res.json(error);
        });
    } else {
        res.status(400).json({'msg': 'Passwords do not match'});
    }
});

router.post('/ProfileUpdate', function (req, res) {
	UserDAO.createUserProfile(getProfileDate(req));
	console.log('User ' + req.body.username + ' profile updated');
	res.json({url:"/", message: 'User profile updated'});
});

router.post("/login", function(req,res) {
	
	credentials = getCredentials(req)
	
	UserDAO.getUser(credentials.username).then(function(user) {
		if (user != null && authenticator.authenticate(credentials.password, user.dataValues.password)){
      
			res.json({ url: "/main", user: user });
		} else {
			res.status(500)
			res.json({message: "Oops! Something went wrong. Invalid username/password."});
		}
	});
});


// Get a random user; useful for matching process
router.get('/randomUser', function(req, res) {
	console.log('api received ' + req.query.currUserId);
	UserDAO.getRandom(req.query.currUserId).then(function(user) {
		if (user != null) {
			res.json({username: user.username, userID: user.id, school: user.school, firstname: user.firstname, lastname: user.lastname, helpDescription: user.helpDescription})	
		} else {
			res.json({message: "Something went wrong"});
		}
		
	});
});

router.get('/getPotentialMatches', function(req, res) {
	UserMatchDAO.getMatches(req.query.userId).then(function(ids) {
		UserDAO.getUsersById(ids).then(function(users) {
			res.json({matches: users});
		});
	});
});

router.post('/likeUser', function(req, res) {
	UserMatchDAO.addUserMatch(req.body.liker_id, req.body.likee_id, true).then(function(result) {
		if (result.error) 
			res.status(500);

		res.json(result);
	});
});


router.post('/dislikeUser', function(req, res) {
	UserMatchDAO.addUserMatch(req.body.liker_id, req.body.likee_id, false).then(function(result) {
		if (result.error) 
			res.status(500);
		
		res.json(result);
	});
});

// Getting a specific user
// Specify username in GET variable
router.get('/getUser', function(req, res) {

    if (req.query.user) {
        UserDAO.getUser(req.query.user).then(function(user) {
            if (user && user.dataValues) {
              delete user.dataValues.password; // probably not the best idea to send this over the wire
              res.json({user: user.dataValues});
            } else {
              res.json({user: null});
            }
        });
    } else {
        res.sendStatus(401); // bad request; no user included in GET vars
    }
});

router.post('/rateUser', function(req, res) {
	//TODO: Maybe add this logic to the actual UseMatchDB
	if (!req.body.rater_id || !req.body.ratee_id) {
		res.status(401); // bad request; must have both user IDs
		res.json({error: "Invalid user IDs"});
	}
	UserMatchDAO.getMatches(req.body.rater_id).then(function(ids) {
		var match = false;
		for (var i = 0; i < ids.length; i++) {
			if (ids[i] == req.body.ratee_id) {
				match = true;
				break;
			}
		}
		if (match) {
			RatingDAO.addRating(req.body.rater_id, req.body.ratee_id, req.body.rating, req.body.comment).then(function(result) {
				if (result.error)
					res.status(500);
				res.json(result);
			});
		} else {
			res.status(401); // bad request; rater and ratee are not even matched
			res.json({error: "You can't rate someone you aren't matched with"});
		}
	});
});

//Returns an object containing the rating and a the comment that rater gave to ratee
router.get('/getMyRatingFor', function(req, res) {
	if (req.query.rater_id && req.query.ratee_id) {
		RatingDAO.getMyRatingFor(req.query.rater_id, req.query.ratee_id).then(function(result) {
			if (result) {
				res.json({rating: result.rating, comment: result.comment});
			} else {
				res.json({rating:0, comment:''});
			}
		});
	} else {
		res.sendStatus(401); // bad request; need both users in GET vars
	}
});

//Returns average rating and up to 10 reviews that were given for this ratee
router.get('/getRatings', function(req, res) {
	if (req.query.ratee_id) {
		RatingDAO.getRatings(req.query.ratee_id).then(function(result) {
			if (result) {
				res.json({average: result.average, reviews: result.reviews});
			} else {
				res.json({average: 0, reviews: []});
			}
		});
	} else {
		res.sendStatus(401); // bad request; we need to know which user to calculate the average for
	}
});

function getCredentials(req) {
	return {username: req.body.username, password: req.body.password};
}

function getProfileDate(req) {
	return {username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, 
		address: req.body.address, city: req.body.city, country: req.body.country, school: req.body.school, 
		courses: req.body.courses, generalDescription: req.body.generalDescription, helpDescription: req.body.helpDescription, 
		dateOfBirth: req.body.dateOfBirth};
}

// Initialize as either 'db' or 'stub'
function initializeDAOs(mode) {
	UserDAO.init(mode);
	UserMatchDAO.init(mode);
	RatingDAO.init(mode);
}

module.exports = {
	router,
	initializeDAOs: initializeDAOs
};
