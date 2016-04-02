var date = new Date();
var newUserName = date.toUTCString(); // ensures a unique username
var newUserPass = 'hunter2';

var desc = "Lorem ipsum etc etc etc etc";
var help = "I am bad at math, please help me.";
var school = "Univeristy of Manitoba";
var firstname = "Joe";
var lastname = "Schmoe";
var city = "Winnipeg";
var country = "Canada";
var courses = "COMP 1010, CHEM 1300, & Intro to Batman";
var birthMonth = "Apr";
var birthDate = "01";
var birthYear = "1993";

var appURL = 'http://localhost';

module.exports = {

	before : function(browser) {
		// Create an account to be able to access main page
		browser
			.useXpath()
			.url(appURL + '/signup')
			.waitForElementVisible('//*[@id="registerButton"]', 1000)
			.assert.elementPresent('//*[@id="registerButton"]')
			.assert.elementPresent('//*[@id="cancelButton"]')
			.setValue('//*[@id="username"]', newUserName)
			.setValue('//*[@id="password"]', newUserPass)
			.setValue('//*[@id="confirmPassword"]', newUserPass)
			.click('//*[@id="registerButton"]')
			.waitForElementVisible('//*[@id="login-form"]/button', 1000) // redirect to login page
	},

	'Click like & dislike buttons' : function(browser) {
		browser
			.url(appURL) 
			.waitForElementVisible('/html/body', 10000)
			.setValue('//*[@id="username"]', newUserName)
			.setValue('//*[@id="password"]', newUserPass)
			.click('//*[@id="login-form"]/button')
			.waitForElementVisible('//*[@id="userCard"]', 10000)
			// Assert that a new user profile is pulled up after hitting 'like' button
			.getText('//*[@id="userFullName"]', function(user1) {
				browser
					.click('//*[@id="likeButton"]')
					.pause(3000) // allow time for AJAX to complete
					.getText('//*[@id="userFullName"]', function(user2) {
						this.assert.notEqual(user1.value, user2.value);
				})
			})
			// Assert that a new user profile is pulled up after hitting 'dislike' button
			.getText('//*[@id="userFullName"]', function(user1) {
				browser
					.click('//*[@id="dislikeButton"]')
					.pause(3000) // allow time for AJAX to complete
					.getText('//*[@id="userFullName"]', function(user2) {
						this.assert.notEqual(user1.value, user2.value);
				})
			})
			.end()
	},

	'Update user\'s profile' : function(browser) {

		browser
			.url(appURL) 
			.waitForElementVisible('/html/body', 10000)
			.setValue('//*[@id="username"]', newUserName)
			.setValue('//*[@id="password"]', newUserPass)
			.click('//*[@id="login-form"]/button')
			.waitForElementVisible('//*[@id="userCard"]', 10000)
			.url(appURL + '/profile')
			.waitForElementVisible('//*[@id="username"]', 10000)
			.assert.elementPresent('//*[@id="generalDescription"]')
			.assert.elementPresent('//*[@id="helpDescription"]')
			.assert.elementPresent('//*[@id="school"]')
			.assert.elementPresent('//*[@id="firstname"]')
			.assert.elementPresent('//*[@id="lastname"]')
			.assert.elementPresent('//*[@id="city"]')
			.assert.elementPresent('//*[@id="country"]')
			.assert.elementPresent('//*[@id="courses"]')
			.assert.elementPresent('//*[@id="birthMonth"]')
			.assert.elementPresent('//*[@id="birthDate"]')
			.assert.elementPresent('//*[@id="birthYear"]')
			.assert.elementPresent('//*[@id="deleteAccountButton"]')
			.click('//*[@id="editIcon"]')
			.setValue('//*[@id="generalDescription"]', desc)
			.setValue('//*[@id="helpDescription"]', help)
			.setValue('//*[@id="school"]', school)
			.setValue('//*[@id="firstname"]', firstname)
			.setValue('//*[@id="lastname"]', lastname)
			.setValue('//*[@id="city"]', city)
			.setValue('//*[@id="country"]', country)
			.setValue('//*[@id="courses"]', courses)
			.setValue('//*[@id="birthMonth"]', birthMonth)
			.setValue('//*[@id="birthDate"]', birthDate)
			.setValue('//*[@id="birthYear"]', birthYear)
			.execute('scrollTo(0,0)')
			.click('//*[@id="editIcon"]')
			.waitForElementVisible('//*[@id="username"]', 10000)
			.getValue('//*[@id="generalDescription"]', function(found) {
						this.assert.equal(found.value, desc);
			})
			.getValue('//*[@id="helpDescription"]', function(found) {
						this.assert.equal(found.value, help);
			})
			.getValue('//*[@id="school"]', function(found) {
						this.assert.equal(found.value, school);
			})
			.getValue('//*[@id="firstname"]', function(found) {
						this.assert.equal(found.value, firstname);
			})
			.getValue('//*[@id="lastname"]', function(found) {
						this.assert.equal(found.value, lastname);
			})
			.getValue('//*[@id="city"]', function(found) {
						this.assert.equal(found.value, city);
			})
			.getValue('//*[@id="country"]', function(found) {
						this.assert.equal(found.value, country);
			})
			.getValue('//*[@id="courses"]', function(found) {
						this.assert.equal(found.value, courses);
			})
			.getValue('//*[@id="birthMonth"]', function(found) {
						this.assert.equal(found.value, '04');
			})
			.getValue('//*[@id="birthDate"]', function(found) {
						this.assert.equal(found.value, birthDate);
			})
			.getValue('//*[@id="birthYear"]', function(found) {
						this.assert.equal(found.value, birthYear);
			})
			.end();
	},

	'Ensure no themes applied' : function(browser) {
		browser
			.url(appURL) 
			.waitForElementVisible('/html/body', 10000)
			.setValue('//*[@id="username"]', newUserName)
			.setValue('//*[@id="password"]', newUserPass)
			.click('//*[@id="login-form"]/button')
			.waitForElementVisible('//*[@id="userCard"]', 10000)
			.assert.cssClassNotPresent('/html/body', 'theme-water')
			.assert.cssClassNotPresent('/html/body', 'theme-fire')
			.assert.cssClassNotPresent('/html/body', 'theme-earth')
			.assert.cssClassNotPresent('/html/body', 'theme-air')
			.end();
	},

	'Set user\'s theme (trying all themes)' : function(browser) {
		browser
			.url(appURL) 
			.waitForElementVisible('/html/body', 10000)
			.setValue('//*[@id="username"]', newUserName)
			.setValue('//*[@id="password"]', newUserPass)
			.click('//*[@id="login-form"]/button')
			.waitForElementVisible('//*[@id="userCard"]', 10000)
			.click('//*[@id="theme-dropdown"]')
			.waitForElementVisible('//*[@id="theme-original"]', 10000)
			.assert.elementPresent('//*[@id="theme-fire"]')
			.assert.elementPresent('//*[@id="theme-water"]')
			.assert.elementPresent('//*[@id="theme-air"]')
			.assert.elementPresent('//*[@id="theme-earth"]')
			.click('//*[@id="theme-fire"]')
			.assert.cssClassPresent('/html/body', 'theme-fire')
			.click('//*[@id="theme-dropdown"]')
			.click('//*[@id="theme-water"]')
			.assert.cssClassPresent('/html/body', 'theme-water')
			.click('//*[@id="theme-dropdown"]')
			.click('//*[@id="theme-earth"]')
			.assert.cssClassPresent('/html/body', 'theme-earth')
			.click('//*[@id="theme-dropdown"]')
			.click('//*[@id="theme-air"]')
			.assert.cssClassPresent('/html/body', 'theme-air')
			.end();
	}, 

	'Ensure user selected theme is persistent': function(browser) {
		browser
			.url(appURL) 
			.waitForElementVisible('/html/body', 10000)
			.setValue('//*[@id="username"]', newUserName)
			.setValue('//*[@id="password"]', newUserPass)
			.click('//*[@id="login-form"]/button')
			.waitForElementVisible('//*[@id="userCard"]', 10000)
			.click('//*[@id="theme-dropdown"]')
			.waitForElementVisible('//*[@id="theme-original"]', 10000)
			.assert.elementPresent('//*[@id="theme-fire"]')
			.assert.elementPresent('//*[@id="theme-water"]')
			.assert.elementPresent('//*[@id="theme-air"]')
			.assert.elementPresent('//*[@id="theme-earth"]')
			.click('//*[@id="theme-fire"]')
			.assert.cssClassPresent('/html/body', 'theme-fire')
			.click('//*[@id="logout"]')
			.waitForElementVisible('/html/body', 10000)
			.setValue('//*[@id="username"]', newUserName)
			.setValue('//*[@id="password"]', newUserPass)
			.click('//*[@id="login-form"]/button')
			.waitForElementVisible('//*[@id="userCard"]', 10000)
			.assert.cssClassPresent('/html/body', 'theme-fire')
			.end();
	},

	'Ensure test_user_1 & test_user_2 are matched': function (browser) {
		var user1 = 'test_user_1';
		var user2 = 'test_user_2';
		var user1ID = 52;
		var user2ID = 53;

		browser
			.url(appURL)
			.waitForElementVisible('/html/body', 10000)
			.setValue('//*[@id="username"]', user1)
			.setValue('//*[@id="password"]', user1)
			.click('//*[@id="login-form"]/button')
			.waitForElementVisible('//*[@id="userCard"]', 10000)
			.click('//*[@id="matchesLink"]')
			.waitForElementVisible('//*[@id="matchesContainer"]/a/div/div', 100000)
			.assert.elementPresent('//*[@id="matchesContainer"]/a')
			.assert.attributeContains('//*[@id="matchesContainer"]/a', 'value', user2ID)
			.click('//*[@id="logout"]')
			// Now verify test_user_2 also sees the match
			.waitForElementVisible('/html/body', 10000)
			.setValue('//*[@id="username"]', user2)
			.setValue('//*[@id="password"]', user2)
			.click('//*[@id="login-form"]/button')
			.waitForElementVisible('//*[@id="userCard"]', 10000)
			.click('//*[@id="matchesLink"]')
			.waitForElementVisible('//*[@id="matchesContainer"]/a/div/div', 100000)
			.assert.elementPresent('//*[@id="matchesContainer"]/a')
			.assert.attributeContains('//*[@id="matchesContainer"]/a', 'value', user1ID)
			.end();
	},

	'Ensure test_user_3 sees the rejection from test_user_2': function (browser) {
		var user2 = 'test_user_2';
		var user3 = 'test_user_3';
		var user2ID = 53;

		browser
			.url(appURL)
			.waitForElementVisible('/html/body', 10000)
			.setValue('//*[@id="username"]', user3)
			.setValue('//*[@id="password"]', user3)
			.click('//*[@id="login-form"]/button')
			.waitForElementVisible('//*[@id="userCard"]', 10000)
			.click('//*[@id="rejectionsLink"]')
			.waitForElementVisible('//*[@id="matchesContainer"]/a/div/div', 100000)
			.assert.elementPresent('//*[@id="matchesContainer"]/a')
			.assert.attributeContains('//*[@id="matchesContainer"]/a', 'value', user2ID)
			.end();
	},

	'Ensure proper chat functionality': function (browser) {
		// There are two users that are in the db fill script we can use here
		var user1 = 'test_user_1';
		var user2 = 'test_user_2';
		var msg = 'Hello test_user_2!';


		browser
			.url(appURL)
			.waitForElementVisible('/html/body', 10000)
			.setValue('//*[@id="username"]', user1)
			.setValue('//*[@id="password"]', user1)
			.click('//*[@id="login-form"]/button')
			.waitForElementVisible('//*[@id="userCard"]', 10000)
			.click('//*[@id="matchesLink"]')
			.waitForElementVisible('//*[@id="matchesContainer"]/a/div/div', 100000)
			.click('//*[@id="matchesContainer"]/a/div/div/img')
			.waitForElementVisible('/html/body/div[2]/div/div', 10000)
			.click('//*[@id="userTabs"]/li[3]/a')
			.waitForElementVisible('//*[@id="m"]', 10000)
			.setValue('//*[@id="m"]', msg)
			.click('//*[@id="contactInfo"]/div/div/form/button')
			.waitForElementVisible('//*[@id="messages"]/li[1]', 10000)
			.assert.elementPresent('//*[@id="messages"]/li[2]') // Warning user that other user is not online
			.click('//*[@id="logout"]')
			.waitForElementVisible('/html/body', 10000)
			.setValue('//*[@id="username"]', user2)
			.setValue('//*[@id="password"]', user2)
			.click('//*[@id="login-form"]/button')
			.waitForElementVisible('//*[@id="userCard"]', 10000)
			.click('//*[@id="matchesLink"]')
			.waitForElementVisible('//*[@id="matchesContainer"]/a/div/div', 100000)
			.click('//*[@id="matchesContainer"]/a/div/div/img')
			.waitForElementVisible('/html/body/div[2]/div/div', 10000)
			.click('//*[@id="userTabs"]/li[3]/a')
			.waitForElementVisible('//*[@id="m"]', 10000)
			.assert.containsText('//*[@id="messages"]/li[1]', msg)
			.end();
	},

	'Ensure leaderboard is accurate': function (browser) {
		var firstPlaceUser = 'test_user_2';
		var uknownPlaceUser = 'test_user_1';

		browser
			.url(appURL)
			.waitForElementVisible('/html/body', 10000)
			.setValue('//*[@id="username"]', newUserName)
			.setValue('//*[@id="password"]', newUserPass)
			.click('//*[@id="login-form"]/button')
			.waitForElementVisible('//*[@id="userCard"]', 10000)
			.click('//*[@id="leadersLink"]')					
			.waitForElementVisible('/html/body/div[2]/table', 10000)
			.assert.elementPresent('/html/body/div[2]/table/tbody/tr[1]/td[1]')
			.assert.containsText('/html/body/div[2]/table/tbody/tr[1]/td[1]', firstPlaceUser)
			// test_user_1 will be either in 2nd or 3rd place
			// Assert that they are at least SOMEWHERE in the table
			.assert.containsText('/html/body/div[2]/table', uknownPlaceUser)
			.end();
	},
}