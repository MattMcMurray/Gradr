$('#registerButton').click(function(e) {
    e.preventDefault();
    resgisterUser();
});

$('#cancelButton').click(function(e) {
    e.preventDefault();
    getNewUser();
});

$("form").on('submit', function(event) {
	event.preventDefault();

	var sendData = {
		username: $('#username').val();
		password: $('password').val();
		confirmPassword: $('confirmPassword').val();
	}
	$.ajax({
		type: 'POST',
		url: 'http://localhost:80/api/NewUser',
		success: function() {
			console.log('saved ' + sendData.username);
		}
		error: function() {
			console.log('error saving ' + sendData.username);
		}
	})
})