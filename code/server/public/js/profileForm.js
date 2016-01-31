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
/*
$(function() {
	console.log('profileForm.js function session username');
	console.log(sessionStorage.getItem('username'));
    getUser(sessionStorage.getItem('username'));
});
*/
function getUser(username) {
	console.log('profileForm.js getUser username')
	console.log(username);
    $.ajax({
    	type: 'GET',
        url: '/api/getUser?user=' + username,
        success: userCallback
    });
}

var firstnameData;
var lastnameData;
var cityData;
var countryData;
var coursesData;
var schoolData;
var generalDescriptionData;
var helpDescriptionData;
var dateOfBirthData;

var userCallback = function(data) {
	console.log('profileForm.js getCallback Data');
	console.log(data);

	
	//firstnameData = data.user.firstname;
	lastnameData = data.lastname;
	cityData = data.city;
	countryData = data.country;
	coursesData = data.courses;
	schoolData = data.school;
	generalDescriptionData = data.generalDescription;
	helpDescriptionData = data.helpDescription;
	dateOfBirthData = data.dateOfBirth;



    $('#firstnameData').html(data.user.firstname);
    $("#lastnameData").html(data.lastname);
    $("#cityData").html(data.city);
    $("#countryData").html(data.country);
    $("#schoolData").html(data.school);
    $("#coursesData").html(data.courses);
    $("#generalDescriptionData").html(data.generalDescription);
    $("#helpDescriptionData").html(data.helpDescription);
    $("#dateOfBirthData").html(data.dateOfBirth);

	/*
    $('#firstname').html(toTitleCase(data.firstname));
    $("#lastname").html(toTitleCase(data.lastname));
    $("#city").html(toTitleCase(data.city));
    $("#country").html(toTitleCase(data.country));
    $("#school").html(toTitleCase(data.school));
    $("#courses").html(toTitleCase(data.courses));
    $("#generalDescription").html(toTitleCase(data.generalDescription));
    $("#helpDescription").html(toTitleCase(data.helpDescription));
    $("#dateOfBirth").html(toTitleCase(data.dateOfBirth));
*/
}
