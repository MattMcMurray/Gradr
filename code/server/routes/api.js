var _express = require('express');

var router = _express.Router();

router.get("/", function (req, res) {
	res.json({message: 'Hello world!'});
});



module.exports = {router};