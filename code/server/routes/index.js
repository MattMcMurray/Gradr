var _express = require('express');
var router = _express.Router();

router.get("/", function (req, res) {
    res.render('../templates/index', {});
});

module.exports = {router};

