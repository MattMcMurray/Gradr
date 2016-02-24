describe('DOM Tests', function() {
	location.href = 'localhost';
	it('Test getUserInfo()', function(done) {
		var userInfo = getUserInfo();
		// Since there is no logged in user, function should return empty strings
		expect(userInfo.username).to.equal("");
		expect(userInfo.dateOfBirth).to.equal("");
		done();
	});



	it('Test setBirthDate()', function(done) {
		// setBirthDate(1993 04 01);

		// console.log(document.getElementById('birthYear');)
		// console.log(document.getElementById('birthMonth');)
		// console.log(document.getElementById('birthDate');)
		// done();
	});
});