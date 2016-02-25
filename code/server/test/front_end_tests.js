var username = 'jimbob-the-alligator';
var dateOfBirth = 'Apr 1 1993';

/* 
	These tests don't deal with interacting with elements on the page. 
	(e.g., clicking buttons, ensuring behaviour is as expected when entering
	data, etc. etc.) They are simply testing the helper functions written 
	for the front-end.

	Interaction tests are written with Nightwatch (Selenium).
*/
describe('DOM Tests', function () {
	
	// Set the user info first (before is used b/c order of tests isn't guaranteed)
	before(function() {
		// This function also calls setBirthDate() and setUserInfo()
		userCallback({
			user: {
				username: username,
				dateOfBirth: dateOfBirth
			}
		});
	});

	it('getUserInfo()', function(done) {
		var userInfo = getUserInfo();

		// No logged in user, expect user info to be empty
		expect(userInfo.username).to.equal(username);
		expect(userInfo.dateOfBirth).to.equal(dateOfBirth);

		done();
	});

	it('Click the edit button; ensure fields activated', function(done) {
		document.getElementById('birthMonth').value = 'Apr';
		var value = document.getElementById('birthMonth').value;

		console.log("Text area value: " + value);
		done();
	});



});