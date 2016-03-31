var socket = io();

socket.emit('online', {sender: $('#profileId').html() ,userId: sessionStorage.getItem('user_id')});

var chat = $("#messages");
$('form').submit(function(event){
	event.preventDefault();
	
	console.log("send message");
	socket.emit('private message',{sender: sessionStorage.getItem('user_id') ,receiver: $('#profileId').html() , body:$('#m').val()} );
	$('#messages').append($('<li>').text("Me: " + $("#m").val()));
	$("#m").val("");
	chat.scrollTop(chat[0].scrollHeight);
	return false;
});

socket.on('send message', function(msg){
    $('#messages').append($('<li>').text($(".username").html() + ": " + msg));
    chat.scrollTop(chat[0].scrollHeight);
});

socket.on('send messages to user', function(messages){
	
	
	for (var i = 0; i < messages.length; i++) {
		
		if (messages[i].sender == sessionStorage.getItem('user_id')) {
			$("#messages").append($('<li class="receiver">').text("Me" + ": " +messages[i].message));
		} else {
			$("#messages").append($('<li>').text($(".username").html() + ": "+ messages[i].message));
		}
	}

	chat.scrollTop(chat.scrollHeight);

});

socket.on('error message', function(msg) {
	$('#messages').append($('<li class=\'error\'>').text(msg));
	chat.scrollTop(chat[0].scrollHeight);
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


