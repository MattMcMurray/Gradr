var $matches = $('#matches');

$(function() {
	if (sessionStorage.getItem('user_id') == null) {
		window.location.replace('/');
	}
	$.ajax({
		type: 'GET',
		url: 'api/getPotentialMatches?userId=' + sessionStorage.getItem('user_id'),
		success: populateMatches,
	});
});

var populateMatches = function(data) {
	if (data == null) {
		console.log("Error retrieving user matches");
		return;
	}
	matches = data.matches;
	for (var i = 0; i < matches.length; i++) {
		createMatchCard(matches[i].firstname + " " + matches[i].lastname);
	}
}

function createMatchCard(fullName) {
	var cardHTML = 
		"<div class='col-sm-6 col-md-4'>" +
			"<div class='thumbnail'>" +
				"<img src='http://thecatapi.com/api/images/get?format=src&type=jpg&size=small'/>" +
				"<div class='caption'>" +
					"<h3>" + fullName + "</h3>" +
				"</div>" +
			"</div>" +
		"</div>";

	$matches.append(cardHTML);
}