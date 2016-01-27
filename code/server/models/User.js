var Sequelize = require("sequelize");
var connection = require("../database.js")

UserConnection = connection.define('users', {
	username: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false
	}, 
	firstname: {
		type: Sequelize.STRING,
		allowNull: false
	}, 
	lastname: {
		type: Sequelize.STRING,
		allowNull: false
	}, 
	//Did we want to split the address into address/country/city, have all three fields in one string, or have no address at all and just rely on school
	address: {
		type: Sequelize.STRING,
		allowNull: false
	}, 
	city: {
		type: Sequelize.STRING,
		allowNull: false
	}, 
	country: {
		type: Sequelize.STRING,
		allowNull: false
	}, 
	school: {
		type: Sequelize.STRING,
		allowNull: false
	}, 
	courses: {
		type: Sequelize.STRING,
		allowNull: false
	}, 
	//A string for just information not captured by the other fields.
	generalDescription: {
		type: Sequelize.STRING,
		allowNull: false
	}, 
	//A string for describing what courses/subject you are looking for help with
	helpDescription: {
		type: Sequelize.STRING,
		allowNull: false
	}, 
	dateOfBirth: {
		type: Sequelize.DATE,
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

var createUser = function(username, password, firstname, lastname, address, city, country, school, courses, generalDescription, helpDescription, dateOfBirth) {
	
	return UserConnection.create({
		username: username,
		password: password, 
		firstname: firstname,
		lastname: lastname,
		address: address,
		city: city,
		country: country,
		school: school,
		courses: courses,
		generalDescription: generalDescription,
		helpDescription: helpDescription,
		dateOfBirth: dateOfBirth
	});
}

var getAllUsers = function() {
	return UserConnection.findAll();
}

module.exports = {
	getUser: getUser,
	createUser: createUser
}