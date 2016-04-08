var MessagesInterface = require('../interfaces/MessagesInterface.js');

var messageList, message1, message2, message3;

function MessagesStub() {
	message1 = {
		message: "Hi, how are you?",
		sender: 205,
		receiver: 206,
		sent: false
	};
	message2 = {
		message: "Doing well, you?",
		sender: 206,
		receiver: 205,
		sent: false
	};
	message3 = {
		message: "I'm doing pretty well as well. Thanks!",
		sender: 205,
		receiver: 206,
		sent: false
	};

	messageList = [];
	messageList.push(message1);
	messageList.push(message2);
	messageList.push(message3);
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

MessagesStub.prototype.getAllMessages = function(sender, receiver) {
	return new Promise(function(resolve, reject) {
		resolve(findMessage(sender, receiver).concat(findMessage(receiver, sender)));
	}).catch(function(error) {
		reject(error);
	});
}

MessagesStub.prototype.saveMessage = function(messageObject) {
	
	return new Promise (function(resolve, reject) {
		messageList.push(messageObject);

		resolve(messageObject);
	}).catch(function(error) {
		reject(error);
	});
}

MessagesStub.prototype.removeUser = function(userID) {
    var ids = [];

    for (var i = 0; i < messageList.length; i++) {
        if (messageList[i].receiver === userID || messageList[i].sender === userID) {
            ids.push(i);
        }
    }

    for (var i = ids.length - 1; i >= 0; i--) {
        messageList.splice(ids[i], 1);
    }

    return new Promise(function(resolve, reject) {
        resolve(ids);
    });
};

module.exports = MessagesStub;

/*Helper functions*/

function findMessage(sender, receiver) {
	var messages = [];
	//retrieve message for receiver

	for (var i =0; i < messageList.length; i++) {
		if (messageList[i].sender == sender && messageList[i].receiver == receiver && messageList[i].sent == false) {
			messages.push(messageList[i]);
		}
	}

	return messages;
}