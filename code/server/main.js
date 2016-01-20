

var server = (function(){

	var _express = require('express');
	var _bodyParser = require('body-parser');
	var _app = _express();
	var _port = process.env.PORT || 8080;

	function initialize() {
		_app.use(_bodyParser.urlencoded({extended: true}));
		_app.use(_bodyParser.json());

		initEndPoint();

		_app.listen(_port, function() {
			console.log("App running on localhost %s", JSON.stringify(this.address()));
		});
		//test api route 
		
	}

	function initEndPoint() {

		var router = _express.Router();
		router.get("/", function(req, res) {
			res.json({message: 'Hello World!'});
		});

		_app.use("/api", router);

	}


	return {
		initialize: initialize
	};


})();


server.initialize();