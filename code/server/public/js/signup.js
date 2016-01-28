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
			url: 'http://localhost:80/api/NewUser',
			data: sendData,
			success: function() {
				console.log('saved ' + sendData.username);
				location.href = 'http://localhost:80/'
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