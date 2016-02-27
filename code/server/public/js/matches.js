$(function() {
	if (sessionStorage.getItem('user_id') == null) {
		window.location.replace('/');
	}
});