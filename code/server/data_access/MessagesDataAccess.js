var MessagesDB = require('../models/MessagesDB.js');
var MessagesStub = require('../stubs/MessagesStub.js');

var messagesDAO;

var init = function(mode) {
    if (mode == 'stub')
        messagesDAO = new MessagesStub();
    else if (mode == 'db')
        messagesDAO = new MessagesDB();
    else
        throw '\'' + mode + '\' is not a valid mode. Use \'db\' or \'stub\'.'
}

var getMessages = function(sender, receiver) {
	return messagesDAO.getMessages(sender, receiver);
}

var getAllMessages = function(sender, receiver) {
    return messagesDAO.getAllMessages(sender, receiver);
}

var saveMessage = function(messageObject) {
	return messagesDAO.saveMessage(messageObject);
}

module.exports = {
	init: init,
	getMessages: getMessages,
	saveMessage: saveMessage,
    getAllMessages: getAllMessages
}