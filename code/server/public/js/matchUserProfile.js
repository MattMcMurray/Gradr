$('#userTabs a').click(function(event) {
	event.preventDefault();
	var chat = $("#messages");
	chat.scrollTop(chat[0].scrollHeight);
	$(this).tab('show');

});

$("#submitComment").click(function(event){
	event.preventDefault();

	var comment = $("#commentBox").val();
	//comment box cannot be empty
	console.log(comment.length);


	if (comment.length !== ""){

		comment = cleanComment(comment);

		console.log($("#profileId").html());
		$.ajax({
			type:'post',
			url: '/api/rateUser',
			data: {
				comment: comment,
				rater_id: sessionStorage.getItem('user_id'),
				ratee_id: $("#profileId").html(),
				rating: $("#rating").val(),

			}
		});
		location.reload();
	} else {
		var cBox = $("#commentBox");
		if (!cBox.hasClass("invalid")){
			cBox.toggleClass("invalid");	
		}
		
	}
});

function cleanComment(comment) {
	return comment.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

module.exports = {		
	cleanComment		
}