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

router.get("/profile", function(req, res) {
	res.render('../views/profile');
});

module.exports = {router};

