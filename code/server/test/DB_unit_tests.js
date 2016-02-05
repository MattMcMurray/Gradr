var app = require('../main.js');
var userMatches = require('../models/UserMatches.js');
var User = require('../models/User.js');
var request = require('supertest');
var assert = require('assertthat'); // View README for documentation https://github.com/thenativeweb/assertthat


describe('Database query tests', function() {

	describe('UserMatches queries', function() {
		
		describe('addUserMatch', function() {
			it('adds a new like or dislike to the table', function(done) {
				userMatches.addUserMatch(1,2,true).then(function(data){
					console.log(data);
					assert.that(data).is.not.null();
					assert.that(data.liker_id).is.equalTo(1);
					assert.that(data.likee_id).is.equalTo(2);
					assert.that(data.likes).is.equalTo(true);
					done();
				}); //adds a new like
			});
		});

		describe('getMatches', function() {
			it('returns a match record for given userid',function(done){
				userMatches.addUserMatch(2,1,true).then(function(data){
					userMatches.getMatches(1).then(function(data2){
					assert.that(data).is.not.null();
					assert.that(data.liker_id).is.equalTo(2);
					assert.that(data.likee_id).is.equalTo(1);
					assert.that(data.likes).is.equalTo(true);
					done();
					});	
				});
				
			});
		});

		describe('getPreviouslyRatedIds', function(){
			it('returns a list of all liked/disliked ids',function(done){
				userMatches.getPreviouslyRatedIds(1).then(function(data){
					assert.that(data).is.not.null();
					done();
				});
			});
		});

	});

	describe('User queries', function(){
		describe('getUser', function(){
			it('returns user data for given username', function(done){
				User.getUser('jflores1').then(function(data){
					assert.that(data).is.not.null();
					assert.that(data.username).is.equalTo('jflores1');
					done();
				});
			});
		});

		describe('getUsersById', function() {

			it ('returns user data of the give userid', function(done) {
				User.getUsersById(1).then(function(user){
					
					assert.that(user).is.not.null();
					assert.that(user.length).is.equalTo(1);
					assert.that(user[0].username).is.equalTo('jflores1');
					assert.that(user[0].firstname).is.equalTo('Justin');
					assert.that(user[0].lastname).is.equalTo('Flores');
					assert.that(user[0].city).is.equalTo('Dauphin');
					assert.that(user[0].country).is.equalTo('Canada');
					assert.that(user[0].school).is.equalTo('University of Manitoba');
					assert.that(user[0].courses).is.equalTo('Programming Practices');
					done();
				});
			});

			it('returns a list user data when  given a list of userIds', function(done) {
				User.getUsersById([1,2,3]).then(function(users){
					assert.that(users).is.not.null();
					assert.that(users.length).is.equalTo(3);
					done();
				});
			});
		});

		describe('getAllUsers', function() {
			it('returns a list of all the users. Will only test for length and that value is not null', function(done){
				User.getAllUsers().then(function(users){
					assert.that(users).is.not.null();
					assert.that(users.length).is.not.equalTo(0);
					done();
				});
			});
		});

		describe('createUser', function() {
			it('creates a user and adds to the database', function(done){
				User.createUser({username:'hibbityhoppity', password:'hello1'}).then(function(user){
					assert.that(user).is.not.null();
					assert.that(user.username).is.equalTo('hibbityhoppity');
					done();
				}).catch(function(error){
					assert.that(error.message).is.equalTo('Validation error');
					assert.that(error.errors[0].type).is.equalTo('unique violation');
					done();
				});
			});
		});

		
		describe('createUserProfile', function(){
			it('updates the users profile', function(done){
				var school = "University of Manitoba";
				User.createUserProfile({
					username: "jjorell",
					school: school
				}).then(function(){
					User.getUser('jjorell').then(function(user){
						assert.that(user.school).is.equalTo(school);
						done();
					});
				});
			});
		});


		describe('getRandom', function() {
			it('returns a random user who is not requesting user and has not been previously rated', function(done){
				User.getRandom(2).then(function(user){
					assert.that(user).is.not.null();
					assert.that(user.username).is.not.equalTo('jflores1');
					done();
				});
			});
		})

	});
});