var date = new Date();
var newUserName = date.toUTCString(); // ensures a unique username
var newUserPass = 'hunter2';

var appURL = 'http://localhost';

module.exports = {

	before : function(browser) {
		// Create an account to be able to access main page
		browser
			.useXpath()
			.url(appURL + '/signup')
			.waitForElementVisible('/html/body/div[3]/form', 1000)
			.assert.elementPresent('//*[@id="registerButton"]')
			.assert.elementPresent('//*[@id="cancelButton"]')
			.setValue('//*[@id="username"]', newUserName)
			.setValue('//*[@id="password"]', newUserPass)
			.setValue('//*[@id="confirmPassword"]', newUserPass)
			.click('//*[@id="registerButton"]')
			.waitForElementVisible('/html/body/div[3]/form', 1000) // redirect to login page
	},

	'Click like & dislike buttons' : function (browser) {
		browser
			.url(appURL) 
			.waitForElementVisible('/html/body', 10000)
			.setValue('//*[@id="username"]', newUserName)
			.setValue('//*[@id="password"]', newUserPass)
			.click('//*[@id="login-form"]/button')
			.waitForElementVisible('//*[@id="userCard"]', 10000)
			.end()
	}
}