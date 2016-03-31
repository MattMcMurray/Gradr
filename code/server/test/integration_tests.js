var app = require('../main.js');
var request = require('supertest');
var assert = require('assertthat'); // View README for documentation https://github.com/thenativeweb/assertthat

//////////////////////////////////////////////////
// ALL INTEGRATION TESTS SHOULD GO IN THIS FILE // 
//////////////////////////////////////////////////

var username = "mynewusername";
var password = "hunter2";
var wrongPassword = "drowssap";

// Fake user details
var firstname = 'Joe';
var lastname = 'Shmoe';
var city = 'Winnipeg';
var country = 'Canada';
var courses = 'COMP 1010, STAT 1000, MATH 1500';
var school = 'University of Manitoba';
var generalDescription = 'I am awesome and dedicated';
var userID;

describe('Integration Tests', function() {
    
    // BIG USER STORY 1
    describe('User Creation', function() {

        it('Try to create user with mismatched passwords', function(done) {
            // first make a request with mismatching passwords to make sure server responds appropriately
            request(app)
            .post('/api/newUser')
            .type('form')
            .send({'username': username, 'password': password, 'confirmPassword': wrongPassword})
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8') 
            .end(function(err, res) {
                if (err) done(err);
                assert.that(res.body.msg).is.equalTo('Passwords do not match');
                done();
            });
        });

        it('Create valid user', function(done) {
            // now create a VALID user and expect a 200 response
            request(app)
            .post('/api/NewUser')
            .type('form')
            .send({'username': username, 'password': password, 'confirmPassword': password})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8') 
            .end(function(err, res) {
                if (err) done(err);
                assert.that(res.body.url).is.equalTo('/');
                assert.that(res.body.message).is.equalTo('New user created');
                done();
            });
        });

        it('Log in with new user', function(done) {
            // try to login with newly created user and expect 200 and user info
            request(app)
            .post('/api/login')
            .type('form')
            .send({'username': username, 'password': password})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8') 
            .end(function(err, res) {
                if (err) done(err);
                assert.that(res.body.url).is.equalTo('/main')
                assert.that(res.body.user).is.not.null();
                assert.that(res.body.user.username).is.equalTo(username);
                // We don't know the hashed password, but we know it should be there
                assert.that(res.body.password).is.not.null(); 
                done();
            });
        });
    });

    describe('Getting Matches', function() {
        it('Attempts to get the list of matches for a user', function(done) {
            // request the app for 'my' id 
            request(app)
            .get('/api/getUser?user=' + username)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8') 
            .end(function(err, res) {
                if (err) done(err);
                assert.that(res.body.user.username).is.equalTo(username);

                userID = res.body.user.id;
                done();
            });
        });

        it('Gets the list of matches', function(done) {
            // Once we've gathered info about the logged in user,
            // request a list of their matches 
            //(list should be empty since the user is new and should not have any matches)

            request(app)
            .get('/api/getPotentialMatches?userId=' + userID)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8') 
            .end(function(err, res) {
                if (err) done(err);
                assert.that(res.body.matches).is.not.null();
                assert.that(res.body.matches).is.equalTo([]);
                done();
            });
        });
    });

    describe('Getting more details about a user', function() {

        it('Fetch a user and ensure details are delivered', function(done) {
            request(app)
            .get('/api/getUser?user=' + username)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8') 
            .end(function(err, res) {
                if (err) done(err);
                // Ensure all fields are returned 
                assert.that(res.body.user).is.not.null();
                assert.that(res.body.user.username).is.equalTo(username);

                // Since this is a new user, none of the profile details are
                // filled in yet
                assert.that(res.body.user.firstname).is.equalTo('');
                assert.that(res.body.user.lastname).is.equalTo('');
                assert.that(res.body.user.city).is.equalTo('');
                assert.that(res.body.user.country).is.equalTo('');
                assert.that(res.body.user.school).is.equalTo('');
                assert.that(res.body.user.courses).is.equalTo('');
                assert.that(res.body.user.generalDescription).is.equalTo('');
                assert.that(res.body.user.helpDescription).is.equalTo('');
                done();
            });
        });

        it('Update the same user\'s profile', function() {
            request(app)
            .post('/api/ProfileUpdate')
            .type('form')
            .send({
                'username': username,
                'firstname': firstname,
                'lastname': lastname,
                'country': country,
                'city': city,
                'school': school,
                'courses': courses,
                'generalDescription': generalDescription
            })
            .expect(200)
            .end(function(err, res) {
                if (err) done(err);
                assert.that(res.body.message).is.equalTo('User profile updated');
                done();
            });
        });

        it('Ensure that the changes made to the user are reflected', function(done) {
            request(app)
            .get('/api/getUser?user=' + username)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8') 
            .end(function(err, res) {
                assert.that(res.body.user.firstname).is.equalTo(firstname);
                assert.that(res.body.user.lastname).is.equalTo(lastname);
                assert.that(res.body.user.city).is.equalTo(city);
                assert.that(res.body.user.country).is.equalTo(country);
                assert.that(res.body.user.school).is.equalTo(school);
                assert.that(res.body.user.courses).is.equalTo(courses);
                assert.that(res.body.user.generalDescription).is.equalTo(generalDescription);
                done();
            });
        });

        it('Get theme of the user', function(done) {
            request(app)
            .get('/api/getTheme?user=' + userID)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.theme).is.null();
                assert.that(res.body.status).is.equalTo('OK');
                done();
            });
        });

        it('Set theme of the user', function(done) {
            request(app)
            .post('/api/setTheme')
            .send({'userId': userID, 'theme': 2})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.status).is.equalTo('OK');
                done();
            });
        });

        it('Get theme the verify the change', function(done) {
            request(app)
            .get('/api/getTheme?user=' + userID)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.theme).is.equalTo(2);
                assert.that(res.body.status).is.equalTo('OK');
                done();
            });
        });

        it('Save a message for retrieval', function(done) {
            request(app)
            .post('/api/saveMessage')
            .send({'message': 'Test message', 'sender': userID, 'receiver': 1, 'sent': true})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.message).is.not.null();
                done();
            });
        });

        it('Gets the message', function(done) {
            request(app)
            .get('/api/getMessages?sender=' + userID + '&receiver=1')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.messages).is.not.null();
                assert.that(res.body.messages.length).is.equalTo(1);
                assert.that(res.body.messages[0].message).is.equalTo('Test message');
                done();
            });
        });

        it('Gets the message with all messages', function(done) {
            request(app)
            .get('/api/getAllMessages?sender=' + userID + '&receiver=1')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.messages).is.not.null();
                assert.that(res.body.messages.length).is.equalTo(1);
                assert.that(res.body.messages[0].message).is.equalTo('Test message');
                done();
            });
        });

        it('Like user 1', function(done) {
            request(app)
            .post('/api/likeUser')
            .send({'liker_id': userID, 'likee_id': 1})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.result).is.not.null();
                done();
            });
        });

        it('Dislike user 2', function(done) {
            request(app)
            .post('/api/dislikeUser')
            .send({'liker_id': userID, 'likee_id': 2})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.result).is.not.null();
                done();
            });
        });

        it('set up match for rating', function(done) {
            request(app)
            .post('/api/likeUser')
            .send({'liker_id': 1, 'likee_id': userID})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.result).is.not.null();
                done();
            });
        })

        it('create a rating for the user', function(done) {
            request(app)
            .post('/api/rateUser')
            .send({'rater_id': 1, 'ratee_id': userID, 'rating': 4, 'comment': 'Test rating'})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.result).is.not.null();
                done();
            });
        });

        it('create a rating for the user\'s friend', function(done) {
            request(app)
            .post('/api/rateUser')
            .send({'rater_id': userID, 'ratee_id': 1, 'rating': 5, 'comment': 'Test rating'})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.result).is.not.null();
                done();
            });
        });

        it('get the rating', function(done) {
            request(app)
            .get('/api/getRatings?ratee_id=' + userID)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body).is.not.null();
                assert.that(res.body.average).is.equalTo(4);
                assert.that(res.body.reviews.length).is.equalTo(1);
                done();
            });
        });

        it('get the rating for the user\'s friend', function(done) {
            request(app)
            .get('/api/getMyRatingFor?ratee_id=1&rater_id=' + userID)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body).is.not.null();
                assert.that(res.body.rating).is.equalTo(5);
                assert.that(res.body.comment).is.equalTo('Test rating');
                done();
            });
        });

        
    });

    describe('Deleting the user', function() {
        it('Delete the user', function(done) {
            request(app)
            .post('/api/deleteUser')
            .type('form')
            .send({ 'userId': userID})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) done(err);
                assert.that(res.body.url).is.equalTo('/');
                done();
            });
        });

        it('Verify the user is gone', function(done) {
            request(app)
            .get('/api/getUser?user=' + username)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8') 
            .end(function(err, res) {
                if (err) done(err);
                assert.that(res.body.user).is.null();                
                done();
            });
        });
    });
});
