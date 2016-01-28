$("#login-form").on('submit', function(event){
	event.preventDefault();
	
	$.ajax({
		type: "POST",
		url: "/api/login",
		data: {username: $("#username").val(), password: $("#password").val()},
		success: function(data){
			console.log(data.url);
			location.href= data.url;
		},
		error: function(data) {
			$("#login-error").show();
		}
	});
});

