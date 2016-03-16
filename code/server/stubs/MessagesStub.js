var MessagesInterface = require('../interfaces/MessagesInterface.js');

var messageList, message1, message2, message3;

function MessagesStub() {
	message1 = {
		message: "Hi, how are you?",
		sender: 205,
		receiver: 206,
		sent: false
	},
	message2 = {
		message: "Doing well, you?",
		sender: 206,
		receiver: 205,
		sent: false
	},
	message2 = {
		message: "I'm doing pretty well as well. Thanks!",
		sender: 205,
		receiver: 206,
		sent: false
	}

	messageList = [message1, message2, message3];
}

MessagesStub.prototype = new MessagesInterface();
MessagesStub.prototype.constructor = MessagesStub;

MessagesStub.prototype.getMessages = function(sender, receiver) {

	return new Promise(function(resolve, reject) {
		resolve(findMessage(sender, receiver));
	}).catch(function(error) {
		reject(error);
	});

}

MessagesStub.prototype.saveMessages = function(messageObject) {
	
	return new Promise (function(resolve, reject) {
		messageList.push(messageObject);

		resolve(messageObject);
	}).catch(function(error) {
		reject(error);
	});
}


module.exports = MessagesStub;

/*Helper functions*/

function findMessage(sender, receiver) {
	var messages = [];
	//retrieve message for receiver
	for (var message in messageList) {

		if (message.receiver == receiver && message.sent == false) {
			messages.push(message);
		}
	}

	return messages;
}