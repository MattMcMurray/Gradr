var newUserName = 'myNewUser';
var newUserPass = 'hunter2';

module.exports = {
	'Create a new account' : function (browser) {
		browser
			.url('http://localhost/')
			.waitForElementVisible('body', 1000)
			.useXpath() // Use XPath selectors instead of CSS selectors
			.click('//*[@id="login-form"]/a')
			.waitForElementVisible('/html/body/div[3]/form', 1000)
			.assert.elementPresent('//*[@id="registerButton"]')
			.assert.elementPresent('//*[@id="cancelButton"]')
			.setValue('//*[@id="username"]', newUserName)
			.setValue('//*[@id="password"]', newUserPass)
			.setValue('//*[@id="confirmPassword"]', newUserPass)
			.click('//*[@id="registerButton"]')
			.waitForElementVisible('/html/body/div[3]/form', 1000) // redirect to login page
			.end();
	}
}