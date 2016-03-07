var socket = io();
$('form').submit(function(event){
	event.preventDefault();
	socket.emit('chat message', $('#m').val());
	$('#m').val();
	return false;
});

socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
});