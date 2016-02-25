var jsdom = require('mocha-jsdom');
var expect = require('chai').expect;

var profileController;
var signupController;

jsdom(); // set up the simulated DOM

var username = 'jimbob-the-alligator';
var dateOfBirth = 'Apr 1 1993';
var birthMonth = 'Apr';
var birthDate = '01';
var birthYear = '1993';

describe('DOM Tests', function () {
	before(function () {
		// import jquery
		$ = require('jquery');

		// import the file we are testing
		profileController = require('../public/js/profile.js'); 
		signupController = require('../public/js/signup.js'); 
	});

	it('profile.js - Test setting and getting user info', function(done) {
		console.log('	' + this.test.title); // Mocha not printing these automatically for some reason

		// This function also calls setBirthDate() and setUserInfo()
		profileController.userCallback({
			user: {
				username: username,
				dateOfBirth: dateOfBirth
			}
		});

	 	// give time to callback above to complete
		setTimeout(function() {
			var userInfo = profileController.getUserInfo();

			// No logged in user, expect user info to be empty
			expect(userInfo.username).to.equal(username);
			expect(userInfo.dateOfBirth).to.equal(dateOfBirth);

		}, 10000);

		done()
	});

	it('singup.js - Test validate function (empty input)', function(done) {
		console.log('	' + this.test.title);

		// Try and submit empty fields
		var result = signupController.validate({
			username: '',
			password: '',
			confirmPassword: ''
		});

		expect(result.valid).to.equal(false);
		expect(result.errors.username).to.equal("Username must be filled in.");
		expect(result.errors.password).to.equal("Password must be filled in.");

		done();
	});

	it('singup.js - Test validate function (mismatched passwords)', function(done) {
		console.log('	' + this.test.title);

		// Try and submit empty fields
		var result = signupController.validate({
			username: username,
			password: 'hunter2',
			confirmPassword: 'different_password'
		});

		expect(result.valid).to.equal(false);
		expect(result.errors.password).to.equal("Passwords must match.");

		done();
	});

	it('singup.js - Test validate function (valid input)', function(done) {
		console.log('	' + this.test.title);

		// Try and submit empty fields
		var result = signupController.validate({
			username: username,
			password: 'hunter2',
			confirmPassword: 'hunter2'
		});

		expect(result.valid).to.equal(true);

		done();
	});
});
