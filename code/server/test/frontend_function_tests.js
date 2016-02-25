var jsdom = require('mocha-jsdom');
var expect = require('chai').expect;

var profileController;
var signupController;
var matchUserProfileController;
var swipeController;

jsdom(); // set up the simulated DOM; jQuery won't work w/out it

/*
	This file tests functions in front end javascript that do 
	NOT DIRECTLY manipulate the DOM. These tests ensure the proper
	functioning of helper functions.
	The nightwatch/selenium tests are responsible for testing changes
	to the DOM.

	It's also not possible to test any functions that use AJAX calls, since they'll be attempting to append relative paths to 'file://location/of/src', so nighwatch tests will cover those as well (those mostly deal with manipulation of the DOM anwyay)
*/

var username = 'jimbob-the-alligator';
var dateOfBirth = 'Apr 1 1993';
var birthMonth = 'Apr';
var birthDate = '01';
var birthYear = '1993';

describe('DOM Tests', function () {
	before(function (done) {
		// import jquery
		$ = require('jquery');

		// import the file we are testing
		profileController = require('../public/js/profile.js'); 
		signupController = require('../public/js/signup.js'); 
		matchUserProfileController = require('../public/js/matchUserProfile.js');
		swipeController = require('../public/js/swipe.js');

		done();
	});

	it('profile.js - Test setting and getting user info', function(done) {

		// Mocha not printing these automatically for some reason
		console.log('	' + this.test.title); 

		// This function also calls setBirthDate() and setUserInfo()
		profileController.userCallback({
			user: {
				username: username,
				dateOfBirth: dateOfBirth
			}
		});

	 	// give time for callback above to complete; otherwise test WILL fail
		setTimeout(function() {
			var userInfo = profileController.getUserInfo();

			expect(userInfo.username).to.equal(username);
			expect(userInfo.dateOfBirth).to.equal(dateOfBirth);

		}, 10000);

		done()
	});

	it('signup.js - Test validate function (empty input)', function(done) {
		console.log('	' + this.test.title);

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

	it('signup.js - Test validate function (mismatched passwords)', function(done) {
		console.log('	' + this.test.title);

		var result = signupController.validate({
			username: username,
			password: 'hunter2',
			confirmPassword: 'different_password'
		});

		expect(result.valid).to.equal(false);
		expect(result.errors.password).to.equal("Passwords must match.");

		done();
	});

	it('signup.js - Test validate function (valid input)', function(done) {
		console.log('	' + this.test.title);

		var result = signupController.validate({
			username: username,
			password: 'hunter2',
			confirmPassword: 'hunter2'
		});

		expect(result.valid).to.equal(true);

		done();
	});

	it('matchUserProfile.js - Test cleanComment function', function(done) {
		console.log('	' + this.test.title);

		//TODO 
		console.log("Not yet implemented");

		done();
	});

	it('swipe.js - Test toTitleCase (all lowercase letters)', function(done) {
		console.log('	' + this.test.title);

		var lowercase = "this sentence is entirely in lowercase";
		var expected = "This Sentence Is Entirely In Lowercase";

		var result = swipeController.toTitleCase(lowercase);

		expect(result).to.equal(expected);
		done();
	});

	it('swipe.js - Test toTitleCase (all uppercase letters)', function(done) {
		console.log('	' + this.test.title);

		var lowercase = "THIS SENTENCE IS ENTIRELY IN UPPERCASE";
		var expected = "This Sentence Is Entirely In Uppercase";

		var result = swipeController.toTitleCase(lowercase);

		expect(result).to.equal(expected);
		done();
	});

	it('swipe.js - Test toTitleCase (already in titlecase)', function(done) {
		console.log('	' + this.test.title);

		var lowercase = "This Sentence Is Entirely In Titlecase";
		var expected = "This Sentence Is Entirely In Titlecase";

		var result = swipeController.toTitleCase(lowercase);

		expect(result).to.equal(expected);
		done();
	});
});
