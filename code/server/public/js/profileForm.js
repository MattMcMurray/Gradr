$("form").on('submit', function(event) {
	event.preventDefault();

	var dateStr = $('#dateOfBirth').val();
	dateStr += 'Z';
	var date = new Date(dateStr);

	var sendData = {
		username: sessionStorage.getItem('username'),
		firstname: $('#firstname').val(),
		lastname: $('#lastname').val(),
		address: $('#address').val(),
		city: $('#city').val(),
		country: $('#country').val(),
		school: $('#school').val(),
		courses: $('#courses').val(),
		generalDescription: $('#generalDescription').val(),
		helpDescription: $('#helpDescription').val(),
		dateOfBirth: date
	};
	/*console.log(sessionStorage.getItem('username'));
		/*console.log($('#firstname').val());
		console.log($('#lastname').val());
		console.log($('#address').val());
		console.log($('#city').val());
		console.log( $('#country').val());
		console.log( $('#school').val());
		console.log($('#courses').val());
		console.log($('#generalDescription').val());
		console.log($('#helpDescription').val());
		console.log( date);*/


		$.ajax({
			type: 'POST',
			url: 'api/ProfileUpdate',
			data: sendData,
			success: function(data) {
				console.log('updated ' + sendData.username + 'profile');
				console.log(data.url);
				//location.href = data.url
			},
			error: function() {
				console.log('error saving ' + sendData.username);
			}
		})
	
});
