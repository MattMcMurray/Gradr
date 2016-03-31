var MessagesDAO = require("../data_access/MessagesDataAccess.js");
module.exports = function(io) {
	var connectedUsers = {};
	io.on('connection', function(socket){
	    
	    console.log('User Connected');
	    

	    socket.on('chat message', function(msg){
	        console.log('message: ' + msg);
	        socket.emit('chat message', msg + "Reply");
	    });

	    socket.on('online', function(credentials) {
	    	console.log("user login");
	        connectedUsers[credentials.userId] = socket;

	        for (var each in connectedUsers){
	    		console.log(each);
	    	}
	    	//check for unsent messages, if there are unsent messages, send it.
	    	MessagesDAO.getAllMessages(credentials.sender, credentials.userId).then(function(messages) {
	    		console.log(messages);
	    		if (messages.length > 0 ) {
	    			socket.emit('send messages to user', messages);
	    		} 
	    	}).catch(function(error) {


	    	});
	    });

	    socket.on('disconnect', function(data){
	    	console.log('diconnecting');

	    	for (var each in connectedUsers){
	    		if(connectedUsers[each] == socket) {
	    			delete connectedUsers[each]
	    			break;
	    		}
	    	}
	    	

	    });

	    socket.on('private message', function(message) {

			var user = connectedUsers[ message.receiver ];
			var messageObject = {
					message: message.body,
					sender: message.sender,
					receiver: message.receiver,
				};
			if (user) {
				console.log("Sending message to user");
				messageObject.sent = true;
				MessagesDAO.saveMessage(messageObject);
				user.emit('send message', message.body);
			} else {
				console.log("Sending error message");
				messageObject.sent = false;
				MessagesDAO.saveMessage(messageObject);
				socket.emit('error message', 'User is currently not online. Your message will be sent once they are');
			}

	    });

	    socket.on('check online', function(matches) {

	    	var onlineMatches = [];
	    	for (var i = 0; i < matches.matches.length; i++){
	    		if (matches.matches[i] in connectedUsers) {
	    			onlineMatches.push(matches.matches[i]);
	    		}
	    	}

	    	console.log(onlineMatches);
	    	socket.emit('online matches', {matches: onlineMatches});
	    });

	});

}