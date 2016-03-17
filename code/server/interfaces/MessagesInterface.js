function MessagesInterface() {}

MessagesInterface.prototype = {
	getMessages: function(sender, receiver) {
		throw "function getMessages() not implemented";
	},
	saveMessage: function(messageObject) {
		throw "function saveMessage() not implemented";
	},
	getAllMessages: function(sender, receiver) {
		throw "function getAllMessages() not implemented";
	}
}

module.exports = MessagesInterface;