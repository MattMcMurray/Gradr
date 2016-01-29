var edit_mode = false;

$(function() {
	// var button = $('#userFullName').val();
	// console.log(button);
	$('#userFullName').append("Steve Bairos-Novak ");
	$('#location').val("University Of Manitoba");
});

$('#editButton').click(function(e) {
	e.preventDefault();
	console.log(edit_mode);
	if (edit_mode) {
		//Might want to instead, make an ajax call to update DB and then refresh page instead of doing this
		toggleDisable('.user-entry', edit_mode);
	} else {
		toggleDisable('.user-entry', edit_mode);
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

// $('#editButton').click(function(e) {
// 	e.preventDefault();

// });