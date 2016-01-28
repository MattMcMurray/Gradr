var Sequelize = require("sequelize");
var connection = require("../database.js");

UserConnection = connection.define('users', {
	username: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

UserConnection.sync()


var getUser = function(username) {
	return UserConnection.findOne({
		where:{
			username: username
		}
	});
}

var createUser = function(username, password) {
	
	return UserConnection.create({
		username: username,
		password: password
	});
}



module.exports = {
	getUser: getUser,
	createUser: createUser
}