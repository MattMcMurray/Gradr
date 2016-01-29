var _express = require('express');

var router = _express.Router();
var app = _express();
var authenticator = require("../mixins/authenticator.js");

// Models
var User = require('../models/User.js');
var Rating = require('../models/Rating.js');

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
      res.json({url: "/main"});
    } else {
      res.status(401); // Unauthorized
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

router.get('/getUserScore', function(req, res) {
  if (req.query.user) {
    Rating.getUserScore(req.query.user).then(function(score) {
      if (score) {
        res.json({'score': score});
      } else {
        res.json({'score': null});
      }
    });
  } else {
    res.status(400).send('Bad request');
  }
});

router.post('/addUserScore', function(req, res) {
  if (req.query.user && req.query.score) {
    Rating.addUserScore(req.query.user, req.query.score);
    res.status(200).send('OK');
  } else {
    res.status(400).send('Bad request');
  }
});

function getCredentials(req){
  return {username: req.body.username, password: req.body.password};
}





module.exports = {router};
