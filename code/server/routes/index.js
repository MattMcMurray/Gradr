var _express = require('express');
var router = _express.Router();

router.get("/", function(req, res) {
    res.render('../views/index', {});
});

router.get("/main", function(req, res) {
    res.render('../views/swipe', {});
});

module.exports = {router};

