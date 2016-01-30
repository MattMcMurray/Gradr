var edit_mode = false;

$(function() {
	$('#location').val("University Of Manitoba");
	console.log(sessionStorage.getItem('username'));
	$.ajax({
		type: 'GET',
		url: 'api/getUser?user=' + sessionStorage.getItem('username'),
	}).then(function(resp) {
		$('#username').append(resp.user.username);
		console.log(resp);
	});
});

$('#editButton').click(function(e) {
	e.preventDefault();
	console.log(edit_mode);
	if (edit_mode) {
		//May want to instead, make an ajax call to update DB and then refresh page instead of doing this
		toggleDisable('.user-entry', edit_mode);
		swapClass('#editIcon', 'fa-check', 'fa-pencil');

		//Do a user update here.
	} else {
		toggleDisable('.user-entry', edit_mode);
		swapClass('#editIcon', 'fa-pencil', 'fa-check');
	}
	edit_mode = !edit_mode;
});

//Function that takes in the tag of all elements you want toggled and then sets them to disabled=toggle
function toggleDisable(tag, toggle) {
	$(tag).each(function(i, obj) {
		console.log(obj);
		obj.disabled = toggle;
	});
}

//Function that will remove oldClass and apply newClass to an HTML element
function swapClass(tag, oldClass, newClass) {
	$(tag).removeClass(oldClass);
	$(tag).addClass(newClass);
}