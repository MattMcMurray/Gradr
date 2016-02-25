$("#matches").click(function(event){
	event.preventDefault();

	location.href = '/matchList?user=' + sessionStorage.getItem('user_id');
});