var edit_mode = false;
var username = '';

var testMode = false;

$(function() {

	// If running tests on the js file, the origin will mess up the 
	// AJAX calls, therefore disable all AJAX 
	// Note: this is a temporary solution until we can find a better way
	// to point AJAX calls to the correct origin when running tests
	if (window.location.origin == 'file://') {
		// testMode = true;
	}


	$('#location').val('University Of Manitoba');
	//I should really check here if the sessionStorage is null and redirect if it is...
	if (sessionStorage.getItem('username') == null) {
		window.location.replace('/');
	}

	if (!testMode) {
		$.ajax({
			type: 'GET',
			url: 'api/getUser?user=' + sessionStorage.getItem('username'),
			success: userCallback,
		});
	}
});

$('#profileButton').click(function(e) {
    e.preventDefault();
});

$('#deleteAccountButton').click(function(e) {
	e.preventDefault();
	
	if (confirm('are you sure you want to delete your account? this cannot be undone')) {
		var sendData = {userId: sessionStorage.getItem('user_id')}

		if (!testMode) {
			$.ajax({
				type: 'POST',
				url: '/api/deleteUser',
				data: sendData,
				success: function (data) {
					sessionStorage.setItem('username', null);
					sessionStorage.setItem('user_id', null);
					window.location.replace('/');
				},
				error: function(error) {
					//TODO: Tell the user about the error.
					console.log('couldn\'t delete account. Looks like you\'re stuck with us');
					console.log(error);
				}
			});
		}
	}
})

$('#editButton').click(function(e) {
	e.preventDefault();
	getUserInfo();
	if (edit_mode) {
		//May want to instead, make an ajax call to update DB and then refresh page instead of doing this
		toggleDisable('.user-entry', edit_mode);
		swapClass('#editIcon', 'fa-check', 'fa-pencil');

		var user = getUserInfo();
		console.log(user);

		if (!testMode) {
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
		}
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
	console.log(data.user);
	$('#username').append(data.user.username);
	setUserInfo(data.user);
	setBirthDate(data.user.dateOfBirth);
}

function setUserInfo(user) {
	$('.user-entry').each(function(i, obj) {
		obj.value = user[obj.id];
	});
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
	//TODO: More validation?
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
