$('#cancelButton').click(function(event) {
    event.preventDefault();
    location.replace('/');
});

$('form').on('submit', function(event) {
	event.preventDefault();

	var sendData = {
		username: $('#username').val(),
		password: $('#password').val(),
		confirmPassword: $('#confirmPassword').val()
	};
	var validationObject = validate(sendData);
	if(validationObject.valid) {

		$.ajax({
			type: 'POST',
			url: 'api/NewUser',
			data: sendData,
			success: function(data) {
				console.log('saved ' + sendData.username);
				location.href = data.url
			},
			error: function() {
				validationObject.errors.username = 'Username is already taken.'
				toggleError(validationObject.errors);
			}
		})
	}
	else {
		toggleError(validationObject.errors)
	}
});


function toggleError(message){
	console.log(message);
	$('#error').html(message.username + ' ' + message.password);
	$('#error').show();

}

function validate(sendData){

	var validationObject = {
		valid: true,
		errors: {
			username: '',
			password: ''
		}
	};
	
	
	if(sendData.username == ''){
		validationObject.valid = false;
		validationObject.errors.username = 'Username must be filled in.'
	}

	if(sendData.password != sendData.confirmPassword){
		validationObject.valid = false;
		validationObject.errors.password = 'Passwords must match.';
	}

	if(sendData.password === ''){
		validationObject.valid = false;
		validationObject.errors.password += 'Password must be filled in.'
	}

	return validationObject;

}

module.exports = {
	validate
}
