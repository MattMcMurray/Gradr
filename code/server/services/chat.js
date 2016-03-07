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

			var user = connectedUsers[ message.userId ];

			if (user) {
				console.log("Sending message to user");
				user.emit('send message', message.body);
			} else {
				console.log("Sending error message");
				socket.emit('error message', 'User is currently not online.');
			}

	    });

	});

}