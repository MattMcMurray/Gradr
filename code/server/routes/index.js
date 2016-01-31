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
	res.render('../views/profileForm', { data: getUser(req.query.user) });
})

router.get("/profile", function(req, res) {
	res.render('../views/profile');
})

function getUser(username) {
	console.log('Getting data');
    if (username) {
        User.getUser(username).then(function(user) {
            if (user) {
              delete user.dataValues.password; // probably not the best idea to send this over the wire
              return user;
            } else {
              return null;
            }
        });
    } else {
        return null;
    }
}

module.exports = {router};

