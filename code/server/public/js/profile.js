var edit_mode = false;
var username = '';

$(function() {
	$('#location').val('University Of Manitoba');
	//I should really check here if the sessionStorage is null and redirect if it is...
	if (sessionStorage.getItem('username') == null) {
		window.location.replace('/');
	}
	$.ajax({
		type: 'GET',
		url: 'api/getUser?user=' + sessionStorage.getItem('username'),
		success: userCallback,
	});
});

$('#profileButton').click(function(e) {
    e.preventDefault();
});

$('#editButton').click(function(e) {
	e.preventDefault();
	getUserInfo();
	if (edit_mode) {
		//May want to instead, make an ajax call to update DB and then refresh page instead of doing this
		toggleDisable('.user-entry', edit_mode);
		swapClass('#editIcon', 'fa-check', 'fa-pencil');

		var user = getUserInfo();
		console.log(user);
		$.ajax({
			type: 'POST',
			url: '/api/ProfileUpdate',
			data: user,
			success: function (data) {
				window.location.replace('/profile');
			},
			error: function(error) {
				//TODO: Tell the user about the error.
				console.log('couldn\'t update');
				console.log(error);
			}
		});
	} else {
		toggleDisable('.user-entry', edit_mode);
		toggleDisable('.birthdate-component', edit_mode);
		swapClass('#editIcon', 'fa-pencil', 'fa-check');
	}
	edit_mode = !edit_mode;
});

var userCallback = function(data) {
	if (data == null) {
		//Do something about this
		return;
	}
	console.log(data);
	username = data.user.username;
	$('#username').append(username);
	$('#generalDescription').html(data.user.generalDescription);
	$('#helpDescription').html(data.user.helpDescription);
	$('#school').val(data.user.school); 
	$('#firstname').val(data.user.firstname);
	$('#lastname').val(data.user.lastname);
	$('#city').val(data.user.city);
	$('#country').val(data.user.country);
	$('#courses').val(data.user.courses);
	setBirthDate(data.user.dateOfBirth);
	//Inputs prefer when you set their value through val
}

//Function that takes in the tag of all elements you want toggled and then sets them to disabled=toggle
function toggleDisable(tag, toggle) {
	$(tag).each(function(i, obj) {
		obj.disabled = toggle;
	});
}

//Function that will remove oldClass and apply newClass to an HTML element
function swapClass(tag, oldClass, newClass) {
	$(tag).removeClass(oldClass);
	$(tag).addClass(newClass);
}

//Get all the info about the user, so it may be updated.
function getUserInfo() {
	var user = {
		'username': username,
		'dateOfBirth': getBirthDate(),
	};
	$('.user-entry').each(function(i, obj) {
		user[obj.id] = obj.value;
	});
	return user;
}

function setBirthDate(date) {
	if (!date || date.length < 10) {
		return;
	}
	$('#birthYear').val(date.substring(0,4));
	$('#birthMonth').val(date.substring(5,7));
	$('#birthDate').val(date.substring(8, 10));
}

function getBirthDate() {
	var birthMonth = $('#birthMonth').val();
	var birthDate = $('#birthDate').val();
	var birthYear = $('#birthYear').val();
	if (birthDate && birthYear && birthMonth) {
		birthDate = parseInt(birthDate);
		birthYear = parseInt(birthYear);
		if (birthDate && birthYear) {
			return birthYear + '-' + birthMonth + '-' + birthDate;
		}
	}
	return '';
}
