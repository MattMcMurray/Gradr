var app = require('../main.js');
var userMatches = require('../data_access/UserMatchDataAccess.js');
var User = require('../data_access/UserDataAccess.js');
var ratings = require('../data_access/RatingDataAccess.js');
var messages = require('../data_access/MessagesDataAccess.js');
var request = require('supertest');
var assert = require('assertthat'); // View README for documentation https://github.com/thenativeweb/assertthat


describe('Database query tests', function() {

	userMatches.init('db');
	User.init('db');
	ratings.init('db');
	messages.init('db');
	
	describe('Rating queries', function() {

		describe('addRating', function() {
			it('adds a new rating to the table', function(done) {
				ratings.addRating(1, 2, 3, "").then(function(data){
					assert.that(data).is.equalTo(true);
					done();
				});
			});
		});

		describe('updateRating', function() {
			it('updates a rating in the table', function(done) {
				ratings.addRating(1, 2, 5, "The most beautiful study partner ever.").then(function(data){
					assert.that(data).is.equalTo(true);
					done();
				});
			});
		});

		describe('getRatings', function() {
			it('gets the average rating and a list of 10 ratings for a given user', function(done) {
				ratings.getRatings(11).then(function(data){
					assert.that(data).is.not.null();
					assert.that(data.average).is.equalTo(3); //If it doesn't match, it's likely because of double rounding
					assert.that(data.reviews.length).is.equalTo(10);
					assert.that(data.reviews[1].rating).is.not.null();
					assert.that(data.reviews[1].comment).is.not.null();
					done();
				});
			});

			it('get an average for a user with fewer than 10 ratings', function(done) {
	            ratings.getRatings(10).then(function(data){
	                assert.that(data).is.not.null();
	                assert.that(data.average).is.equalTo(1);
	                assert.that(data.reviews).is.not.null();
	                assert.that(data.reviews.length).is.equalTo(1);
	                assert.that(data.reviews[0].comment).is.equalTo('Bad guy');
	                done();
	            });
	        });

	        it('get an average for a user with no ratings', function(done) {
	            ratings.getRatings(404).then(function(data){
	                assert.that(data).is.not.null();
	                assert.that(data.average).is.equalTo(0);
	                assert.that(data.reviews).is.not.null();
	                assert.that(data.reviews.length).is.equalTo(0);
	                done();
	            });
	        });
		});

		describe('getMyRatingFor', function() {
			it ('gets the rating for a user', function(done) {
				ratings.getMyRatingFor(9, 11).then(function(data){
					assert.that(data).is.not.null();
					assert.that(data.rating).is.equalTo(1);
					assert.that(data.comment).is.equalTo('Bad guy');
					done();
				});
			});
		});
	});

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

		describe('isMatch', function() {
			it('returns true if a liker and likee has a match', function(done) {
				userMatches.isMatch(2,1).then(function(data) {
					assert.that(data).is.not.null();
					assert.that(data).is.equalTo(true);
					done();
				});
			});

			it('returns false if a liker and likee don\'t have a match', function(done) {
				userMatches.isMatch(2, 404).then(function(data) {
					assert.that(data).is.not.null();
					assert.that(data).is.equalTo(false);
					done();
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

	describe('Message queries', function() {
		describe('getMessages', function() {
			it('returns messsages from 52', function(done) {
				messages.getMessages(52, 51).then(function(data) {
					assert.that(data).is.not.null();
					assert.that(data.length).is.equalTo(1);
					done();
				});
			});

			it('returns messsages from 51', function(done) {
				messages.getMessages(51, 52).then(function(data) {
					assert.that(data).is.not.null();
					assert.that(data.length).is.equalTo(2);
					done();
				});
			});

			it('returns messsages from 402', function(done) {
				messages.getMessages(402, 51).then(function(data) {
					assert.that(data).is.not.null();
					assert.that(data.length).is.equalTo(0);
					done();
				});
			});
		});

		describe('getAllMessages', function() {
			it('returns messages from either 52 or 51', function(done) {
				messages.getAllMessages(52, 51).then(function(data) {
					assert.that(data).is.not.null();
					assert.that(data.length).is.equalTo(3);
					done();
				});
			});

			it('returns messages from either 402 or 51', function(done) {
				messages.getAllMessages(402, 51).then(function(data) {
					assert.that(data).is.not.null();
					assert.that(data.length).is.equalTo(0);
					done();
				});
			});
		});

		describe('saveMessage', function() {
			it('saves a message from 52 to 51', function(done) {
				var messageObject = {
					message: 'Bye',
					sender: 52,
					receiver: 51,
					sent: true
				};
				messages.saveMessage(messageObject).then(function(data) {
					assert.that(data).is.not.null();
					done();
				})
			})
		})
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
					assert.that(user[0].username).is.equalTo('jhudson0');
					assert.that(user[0].firstname).is.equalTo('Joyce');
					assert.that(user[0].lastname).is.equalTo('Hudson');
					assert.that(user[0].city).is.equalTo('Brandon');
					assert.that(user[0].country).is.equalTo('Canada');
					assert.that(user[0].school).is.equalTo('University of Winnipeg');
					assert.that(user[0].courses).is.equalTo('Database Implementation');
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
				User.getRandom(1).then(function(user){
					assert.that(user).is.not.null();
					assert.that(user.username).is.not.equalTo('jhudson0');
					done();
				});
			});
		});

		describe('themes', function() {
			it('sets a theme for a user', function(done) {
				User.setTheme(1, 4).then(function(data) {
					assert.that(data).is.not.null();
					done();
				});
			});

			it('gets the theme', function(done) {
				User.getTheme(1).then(function(data) {
					assert.that(data.dataValues.theme).is.equalTo(4);
					done();
				});
			});
		});

		describe('getRandomBatch', function() {
			it('returns a set of random users that aren\'t the requesting user and have not been rated by the requester. normal case', function(done) {
				User.getRandomBatch(1, 10).then(function(users){
					assert.that(users).is.not.null();
					assert.that(users.length).is.equalTo(10);
					done();
				});
			});

			it('returns a set of random users that aren\'t the requesting user and have not been rated by the requester. giant request', function(done) {
				User.getRandomBatch(1, 1000).then(function(users){
					assert.that(users).is.not.null();
					assert.that(users.length).is.greaterThan(50); //Should have all users, since we want to freely add more test users, this will ensure we have them all
					done();
				});
			});
		});

	});
});