var socket = io();

socket.emit('online', {sender: $('#profileId').html() ,userId: sessionStorage.getItem('user_id')});

$('form').submit(function(event){
	event.preventDefault();

	console.log("send message");
	socket.emit('private message',{sender: sessionStorage.getItem('user_id') ,receiver: $('#profileId').html() , body:$('#m').val()} );
	$('#messages').append($('<li class=\'receiver\'>').text($("#m").val()));
	$("#m").val("");
	return false;
});

socket.on('send message', function(msg){
    $('#messages').append($('<li>').text(msg));
});

socket.on('send messages to user', function(messages){
	console.log(messages);
	for (var i = 0; i < messages.length; i++) {
		console.log(messages[i].message);
		$("#messages").append($('<li class=\'sender\'>').text(messages[i].message));
	}
});

socket.on('error message', function(msg) {
	$('#messages').append($('<li class=\'error\'>').text(msg));
});

socket.on('online matches', function(onlineMatches) {

});
socket.emit('disconnect', {userId: $('#profileId').html()}); 


function getOnline() {
	var matches = {};
	var matchList = [];
	$("#matchesContainer a").each(function() {
		matchList.push($(this).attr('value'));
	});

	matches.matches = matchList;
	socket.emit('check online', matches);
}

getOnline();


