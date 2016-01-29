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


router.get('/randomUser', function(req, res){

	User.getRandom().then(function(user) {
		if (user != null) {
			res.json({username: user.username, school: "University of Manitoba"})	
		} else {
			res.json({message: "Something went wrong"});
		}
		
	});
});

function getCredentials(req){
	return {username: req.body.username, password: req.body.password};
}





module.exports = {router};
