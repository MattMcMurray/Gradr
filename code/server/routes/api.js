var _express = require('express');

var router = _express.Router();
var app = _express();
var UserDAO = require('../data_access/UserDataAccess.js');
var UserMatchDAO = require('../data_access/UserMatchDataAccess.js');
var RatingDAO = require('../data_access/RatingDataAccess.js');
var MessagesDAO = require('../data_access/MessagesDataAccess.js');
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

router.get('/profilePicPlaceholder', function (req, res) {
	var path = require('path');
	res.sendFile('unknown-user.png', { root: path.join(__dirname, '../public/img') });
});

// Get a random user; useful for matching process
router.get('/randomUser', function(req, res) {
	UserDAO.getRandom(req.query.currUserId).then(function(user) {
		if (user != null) {
			res.json({username: user.username, userID: user.id, school: user.school, firstname: user.firstname, lastname: user.lastname, helpDescription: user.helpDescription, picture: user.picture})	
		} else {
			res.json({message: "Something went wrong"});
		}
		
	});
});

// Get a set of random users; useful for matching process
router.get('/userBatch', function(req, res) {
	UserDAO.getRandomBatch(req.query.currUserId, parseInt(req.query.batchSize)).then(function(users) {
		if (users != null) {
			res.json({users: users});
		} else {
			res.json({message: "Something went wrong"});
		}
	});
});

/*UserMatch api calls*/

router.get('/getPotentialMatches', function(req, res) {
	UserMatchDAO.getMatches(req.query.userId).then(function(ids) {
		UserDAO.getUsersById(ids).then(function(users) {
			res.json({matches: users});
		});
	});
});

router.get('/getRejections', function (req, res) {
	UserMatchDAO.getRejections(req.query.userId).then(function(ids) {
		UserDAO.getUsersById(ids).then(function(users) {
			res.json({rejections: users});
		});
	});
})

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


router.get('/getLeaders', function(req,res) {
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
				delete users[i].dataValues.password
				results.push({count: leaders.count[i].count, user: users[i]})
			}
			results.sort(function(a,b) { return parseFloat(b.count) - parseFloat(a.count) } );

			res.json({leaders:results});
		});
		
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
	console.log(req.body);
	if (!req.body.rater_id || !req.body.ratee_id) {
		res.status(401); // bad request; must have both user IDs
		res.json({error: "Invalid user IDs"});
	}
	UserMatchDAO.getMatches(req.body.rater_id).then(function(ids) { 
		var match = false;
		for (var i = 0; i < ids.length; i++) { //TODO: Maybe add this logic to the actual UseMatchDB
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

router.post('/deleteUser', function(req, res) {
	RatingDAO.removeUser(req.body.userId).then(function(result) {
		MessagesDAO.removeUser(req.body.userId).then(function(result) {
			UserMatchDAO.removeUser(req.body.userId).then(function(result) {
				UserDAO.removeUser(req.body.userId).then(function(result) {
					if(result.error)
						res.stats(500);
					else {
						res.json({
							url: '/'
						});
					}
				});
			});
		});
	});
});

/* Messages API Calls*/
router.get('/getMessages', function(req,res) {
	MessagesDAO.getMessages(req.query.sender, req.query.receiver).then(function(messages) {
		res.json({'messages': messages});
	});
});

router.get('/getAllMessages', function(req,res) {
	MessagesDAO.getAllMessages(req.query.sender, req.query.receiver).then(function(messages) {
		res.json({'messages': messages});
	});
});

router.post('/saveMessage', function(req,res) {
	MessagesDAO.saveMessage(req.body).then(function(message){
		res.json(message);
	})
});

/*Theme api call*/

router.post('/setTheme', function (req, res) {
	UserDAO.setTheme(req.body.userId, req.body.theme).then(function(result) {
		if (result.error) {
			res.status(500).send("Internal server error");
		} else {
			res.json({
				status: 'OK'
			});
		}
	});
});

router.get('/getTheme', function (req, res) {
	UserDAO.getTheme(req.query.user).then(function (result) {
		if (result.error) {
			res.status(500).send("Internal server error");
		} else {
			res.json({
				status: 'OK',
				theme: result.dataValues.theme
			});
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
		dateOfBirth: req.body.dateOfBirth, picture: req.body.picture};
}

// Initialize as either 'db' or 'stub'
function initializeDAOs(mode) {
	UserDAO.init(mode);
	UserMatchDAO.init(mode);
	RatingDAO.init(mode);
	MessagesDAO.init(mode);
}

module.exports = {
	router,
	initializeDAOs: initializeDAOs
};
