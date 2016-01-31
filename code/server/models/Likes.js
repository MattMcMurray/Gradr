var Sequelize = require("sequelize");
var connection = require("../database.js")
//Probably needs a better name, since the table is used for both likes and dislikes
LikeConnection = connection.define('likes', {
	username: {
		type: Sequelize.STRING,
		allowNull: false
	},
	targetUsername: {
		type: Sequelize.STRING,
		allowNUll: false
	}, 
	status: {
		type: Sequelize.BOOLEAN,
		allowNull: false
	}
});

LikeConnection.sync()

var createLike = function(username, targetUsername, status) {
	
	return LikeConnection.create({
		username: username,
		targetUsername: targetUsername,
		status: status
	});
}

var getAllLikes = function() {
	return LikeConnection.findAll();
}

var getUserLikes = function(username) {
	return LikeConnection.findAll({
		where: {
			username: username
		}
	});
}

module.exports = {
	createLike: createLike,
	getAllLikes: getAllLikes,
	getUserLikes: getUserLikes
}