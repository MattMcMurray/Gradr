var Sequelize = require("sequelize");
var connection = require("../database.js");
var authenticator = require("../mixins/authenticator.js")

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

var createUser = function(credentials) {
    
    var hashed = authenticator.encrypt(credentials.password);

    return UserConnection.create({
        username: credentials.username,
        password: hashed
    });
}

var getRandom = function() {
    return UserConnection.findAll().then(function(users){
        return users[Math.floor(Math.random() * users.length)];var rand = users[Math.floor(Math.random() * users.length)];
    });
}


module.exports = {
	getUser: getUser,
	createUser: createUser,
	getRandom: getRandom,
	model: UserConnection
}
