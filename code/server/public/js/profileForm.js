$("form").on('submit', function(event) {
	event.preventDefault();

	var date = null;
	var dateStr = $('#dateOfBirth').val();
	if (dateStr !== '') {
		dateStr += 'Z';
		date = new Date(dateStr);
	}
	else {
		date = null;
	}

	var sendData = {
		username: sessionStorage.getItem('username'),
		firstname: $('#firstname').val(),
		lastname: $('#lastname').val(),
		city: $('#city').val(),
		country: $('#country').val(),
		school: $('#school').val(),
		courses: $('#courses').val(),
		generalDescription: $('#generalDescription').val(),
		helpDescription: $('#helpDescription').val(),
		dateOfBirth: date
	};
	$.ajax({
		type: 'POST',
		url: 'api/ProfileUpdate',
		data: sendData,
		success: function(data) {
			console.log('updated ' + sendData.username + 'profile');
			console.log(data.url);
		},
		error: function() {
			console.log('error saving ' + sendData.username);
		}
	})
});
