var Sequelize = require("sequelize");
var connection = require("../database.js");
var User = require("./User.js");

UserMatches = connection.define('user_matches', {
	liker_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		references: {
			model: User.model,
			key: 'id'
		},
		allowNull: false
	},
	likee_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		references: {
			model: User.model,
			key: 'id'
		},
		allowNull: false
	},
	likes: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

UserMatches.sync();

var likeUser = function(liker, likee) {
	UserMatches.upsert({
		liker_id: liker,
		likee_id: likee,
		likes: true
	});
};

var dislikeUser = function(liker_id, likee_id) {
	UserMatches.upsert({
		liker_id: liker,
		likee_id: likee,
		likes: false
	});
};

module.exports = {
	likeUser: likeUser,
	dislikeUser: dislikeUser
}