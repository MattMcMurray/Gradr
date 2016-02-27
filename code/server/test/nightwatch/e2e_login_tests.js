var date = new Date();
var newUserName = date.toUTCString(); // ensures a unique username
var newUserPass = 'hunter2';

var appURL = 'http://localhost';

module.exports = {

	beforeEach : function(browser) {
		browser
			.url(appURL)
			.useXpath() // Use XPath selectors instead of CSS selectors
			.waitForElementVisible('/html/body', 1000)
	},

	'Create a new account' : function(browser) {
		browser
			.click('//*[@id="login-form"]/a')
			.waitForElementVisible('//*[@id="registerButton"]', 1000)
			.assert.elementPresent('//*[@id="registerButton"]')
			.assert.elementPresent('//*[@id="cancelButton"]')
			.setValue('//*[@id="username"]', newUserName)
			.setValue('//*[@id="password"]', newUserPass)
			.setValue('//*[@id="confirmPassword"]', newUserPass)
			.click('//*[@id="registerButton"]')
			.waitForElementVisible('//*[@id="login-form"]/a', 1000) // redirect to login page
			.end();
	},

	'Create account where user already exists' : function(browser) {
		browser
			.click('//*[@id="login-form"]/a')
			.waitForElementVisible('//*[@id="registerButton"]', 1000)
			.assert.elementPresent('//*[@id="registerButton"]')
			.assert.elementPresent('//*[@id="cancelButton"]')
			.setValue('//*[@id="username"]', newUserName)
			.setValue('//*[@id="password"]', newUserPass)
			.setValue('//*[@id="confirmPassword"]', newUserPass)
			.click('//*[@id="registerButton"]')
			.pause(1000)
			.assert.elementPresent('//*[@id="registerButton"]') // make sure we didn't succeed
			.end();
	},

	'Attempt to login with incorrect login info': function(browser) {
		browser
			.setValue('//*[@id="username"]', newUserName)
			.setValue('//*[@id="password"]', 'the_wrong_password')
			.click('//*[@id="login-form"]/button')
			.waitForElementVisible('//*[@id="error"]', 5000)
			.end();
	},

	'Login with correct password': function(browser) {
		browser
			.setValue('//*[@id="username"]', newUserName)
			.setValue('//*[@id="password"]', newUserPass)
			.click('//*[@id="login-form"]/button')
			.end();
	}
}
