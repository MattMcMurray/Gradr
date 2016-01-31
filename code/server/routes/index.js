var _express = require('express');
var router = _express.Router();
var User = require('../models/User.js');

router.get("/", function(req, res) {
    res.render('../views/index', {});
});

router.get("/signup", function(req,res) {
	res.render('../views/signup', {});
});

router.get("/main", function(req, res) {
    res.render('../views/swipe', {});
});

router.get("/profileUpdate", function(req, res) {
	var username = req.query.user;
	if (username) {
        User.getUser(username).then(function(user) {
            if (user) {
              delete user.dataValues.password; 
              res.render('../views/profileForm', { data: user.dataValues });
            } 
        });
    } 
})

router.get("/profile", function(req, res) {
	res.render('../views/profile');
})

module.exports = {router};

