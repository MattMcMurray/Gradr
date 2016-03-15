var ORIGINAL = 0;
var WATER = 1;
var FIRE = 2;
var EARTH = 3;
var AIR = 4;

// ON DOC READY
// ============
$(function() {
	if (sessionStorage.getItem('theme')) {
		themeSwitch(sessionStorage.getItem('theme'));
	} else {
		var user = sessionStorage.getItem('user_id');
		if (user) {
			$.ajax({
				type: 'GET',
				url: '/api/getTheme?user=' + user,
				success: function(data) {
					sessionStorage.setItem('theme', data.theme);
					themeSwitch(data.theme);
				}
			});
		}
	}
});

// BUTTON LISTENERS
// ================
$('#theme-original').click(function() {
	setOriginal();
});

$('#theme-fire').click(function() {
	setFire();
});

$('#theme-water').click(function() {
	setWater();
});

$('#theme-earth').click(function() {
	setEarth();
});

$('#theme-air').click(function() {
	setAir();
});

// FUNCTIONS
// =========
function setOriginal() {
	clearAll();
	sessionStorage.setItem('theme', ORIGINAL);
	postTheme(ORIGINAL);
}

function setFire() {
	clearAll();
	$('body').addClass('theme-fire');
	sessionStorage.setItem('theme', FIRE);
	postTheme(FIRE);
}

function setWater() {
	clearAll();
	$('body').addClass('theme-water');
	sessionStorage.setItem('theme', WATER);
	postTheme(WATER);
}

function setEarth() {
	clearAll();
	$('body').addClass('theme-earth');
	sessionStorage.setItem('theme', EARTH);
	postTheme(EARTH);
}

function setAir() {
	clearAll();
	$('body').addClass('theme-air');
	sessionStorage.setItem('theme', AIR);
	postTheme(AIR);
}

function clearAll() {
	var body = $('body');
	body.removeClass('theme-original');
	body.removeClass('theme-fire');
	body.removeClass('theme-water');
	body.removeClass('theme-air');
	body.removeClass('theme-earth');
}

function themeSwitch(theme) {
	if (theme == null || theme == ORIGINAL) {
		clearAll();
	} else if (theme == WATER) {
		setWater();
	} else if (theme == FIRE) {
		setFire();
	} else if (theme == EARTH) {
		setEarth();
	} else if (theme == AIR) {
		setAir();
	}
}

function postTheme(theme) {
	$.ajax({
		type: 'POST',
		url: '/api/setTheme',
		data: {userId: sessionStorage.getItem('user_id'), theme: theme}
	});
}
