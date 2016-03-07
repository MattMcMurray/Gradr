var socket = io();

socket.emit('online', {userId: sessionStorage.getItem('user_id')});
$('form').submit(function(event){
	event.preventDefault();

	console.log("send message");
	socket.emit('private message',{userId: $('#profileId').html() , body:$('#m').val()} );
	return false;
});

socket.on('send message', function(msg){
    $('#messages').append($('<li>').text(msg));
});

socket.on('error message', function(msg) {
	$('#messages').append($('<li>').text(msg));
});


socket.emit('disconnect', {userId: $('#profileId').html()}); 