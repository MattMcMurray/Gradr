var app = require('../main.js');
var request = require('supertest');
var assert = require('assertthat'); // View README for documentation https://github.com/thenativeweb/assertthat

//////////////////////////////////////////////////
// ALL INTEGRATION TESTS SHOULD GO IN THIS FILE // 
//////////////////////////////////////////////////

var username = "mynewusername";
var password = "hunter2";
var wrongPassword = "drowssap";

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
            .post('/api/newUser')
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
                done()
            });
        });
    });

    describe('Getting Matches', function() {
        var userID;
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
                
                done()
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
                done()
            });
        });
    });
});
