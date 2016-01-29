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


// Get a random user; useful for matching process
router.get('/randomUser', function(req, res){

	User.getRandom().then(function(user) {
		if (user != null) {
			res.json({username: user.username, school: "University of Manitoba"})	
		} else {
			res.json({message: "Something went wrong"});
		}
		
	});
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





module.exports = {router};
