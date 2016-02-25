var jsdom = require('mocha-jsdom');
var expect = require('chai').expect;

var profilejs;

jsdom(); // set up the simulated DOM

var username = 'jimbob-the-alligator';
var dateOfBirth = 'Apr 1 1993';

describe('DOM Tests', function () {
	before(function () {
		// import jquery
		$ = require('jquery');

		// import the file we are testing
		profilejs = require('../public/js/profile.js'); 
	});

	it('userCallback', function(done) {


		done()
	});
	
	// // Set the user info first (before is used b/c order of tests isn't guaranteed)
	// before(function() {
	// 	// This function also calls setBirthDate() and setUserInfo()
	// 	userCallback({
	// 		user: {
	// 			username: username,
	// 			dateOfBirth: dateOfBirth
	// 		}
	// 	});
	// });

	// it('getUserInfo()', function(done) {
	// 	var userInfo = getUserInfo();

	// 	// No logged in user, expect user info to be empty
	// 	expect(userInfo.username).to.equal(username);
	// 	expect(userInfo.dateOfBirth).to.equal(dateOfBirth);

	// 	done();
	// });

	// it('Click the edit button; ensure fields activated', function(done) {
	// 	document.getElementById('birthMonth').value = 'Apr';
	// 	var value = document.getElementById('birthMonth').value;

	// 	console.log("Text area value: " + value);
	// 	done();
	// });

});