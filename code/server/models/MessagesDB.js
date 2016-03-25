var MessagesInterface = require('../interfaces/MessagesInterface.js');
var Sequelize = require('sequelize');
var DBConnection = require('../database.js').sequelize;
var MessagesDAO = require('../data_access/MessagesDataAccess.js');

var Messages = DBConnection.define('messages', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	message: {
		type: Sequelize.STRING,
		allowNull: false
	},
	sender: {
		type: Sequelize.INTEGER,
		references: {
			model: 'users',
			key: 'id'
		},
		allowNull: false,
	},
	receiver: {
		type: Sequelize.INTEGER,
		references: {
			model: 'users',
			key: 'id'
		},
		allowNull: false,

	},	
	sent: {
		type: Sequelize.BOOLEAN,
		allowNull: false
	}
});


function MessagesDB() {
	Messages.sync();
}

MessagesDB.prototype = new MessagesInterface();
MessagesDB.prototype.constructor = MessagesDB;

MessagesDB.prototype.getMessages = function(sender, receiver) {
	return Messages.findAll({
		where: 
			{	sender: sender, receiver: receiver }
	});
}

MessagesDB.prototype.getAllMessages = function(sender, receiver) {
	return Messages.findAll({
		where: Sequelize.or (
			{	sender: receiver, receiver: sender }, 
			{	sender: sender, receiver: receiver }
		)
	});
}


MessagesDB.prototype.saveMessage = function(messageObject) {
	console.log(messageObject);
	return Messages.create(messageObject);
}

module.exports = MessagesDB;