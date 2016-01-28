function validatePasswords(pw1, pw2) {
	return pw1 == pw2;
}

$("form").on('submit', function(event) {
	event.preventDefault();

	var sendData = {
		username: $('#username').val(),
		password: $('#password').val(),
		confirmPassword: $('#confirmPassword').val()
	};
	if(validatePasswords(sendData.password, sendData.confirmPassword)) {

		$.ajax({
			type: 'POST',
			url: 'api/NewUser',
			data: sendData,
			success: function(data) {
				console.log('saved ' + sendData.username);
				location.href = data.url
			},
			error: function() {
				console.log('error saving ' + sendData.username);
			}
		})
	}
	else {
		console.log('passwords no match');
	}
});