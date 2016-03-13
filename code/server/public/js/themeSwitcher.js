$('#theme-original').click(function() {
	clearAll();
});

$('#theme-fire').click(function() {
	clearAll();
	$('body').addClass('theme-fire');
});

$('#theme-water').click(function() {
	clearAll();
	$('body').addClass('theme-water');
});

$('#theme-earth').click(function() {
	clearAll();
	$('body').addClass('theme-earth');
});

$('#theme-air').click(function() {
	clearAll();
	$('body').addClass('theme-air');
});

function clearAll() {
	var body = $('body');
	body.removeClass('theme-original');
	body.removeClass('theme-fire');
	body.removeClass('theme-water');
	body.removeClass('theme-air');
	body.removeClass('theme-earth');
}
