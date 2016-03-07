module.exports = function(io) {
	var connectedUsers = {};
	io.on('connection', function(socket){
	    
	    socket.on('disconnect', function(){
	        console.log("User Disconnected");
	    });

	    socket.on('chat message', function(msg){
	        console.log('message: ' + msg);
	        socket.emit('chat message', msg + "Reply");
	    });

	    socket.on('login', function(credentials) {
	        connectedUsers[credentials.userId] = socket;
	    });

	    socket.on('private message', function(message) {

			var user = connectedUsers[ message.userId ];

			if (user) {
				user.broadcast.emit('send message to ' + message.userId, message.body);
			} else {
				socket.emit('error message', 'User is currently not online.');
			}

	    });

	});

}