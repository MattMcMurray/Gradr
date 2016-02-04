var app = require('../main.js');
var request = require('supertest');
var assert = require('assertthat'); // View README for documentation https://github.com/thenativeweb/assertthat

//////////////////////////////////////////
// ALL API TESTS SHOULD GO IN THIS FILE // 
//////////////////////////////////////////

describe('api', function() {
    // This is just a description, not the actual route the test will use
    describe('GET /api/getUser', function() {
        it('requests a user from the api', function(done) {
            request(app)
            .get('/api/getUser?user=npeters3t') // change to one of the users actually in the test db data
            .expect(200) 
            .expect('Content-Type', 'application/json; charset=utf-8') // self explanatory
            .end(function(err, res) {
                if (err) done(err); // exit if there's an error
                assert.that(res.body.user).is.not.null(); // assert the key 'user' is in the json response
                assert.that(res.body.user.username).is.equalTo("npeters3t");
                assert.that(res.body.user.firstname).is.equalTo("Nicole");
                assert.that(res.body.user.lastname).is.equalTo("Peters");
                assert.that(res.body.user.city).is.equalTo("Dauphin");
                done();
            });
        });

        it('requests a non-existant user from the api', function(done) {
            request(app)
            .get('/api/getUser?user=MichaelMcDoesntExist')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.user).is.null();
                done();
            });
        });
    });

    describe('POST /NewUser', function() {
        it('creates a new user', function(done) {
            request(app)
            .post('/api/NewUser')
            .type('form')
            .send({'username': 'TestingUsername', 'password': 'password', 'confirmPassword': 'password'})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                console.log(res.body);
                assert.that(res.body.message).is.not.null();
                assert.that(res.body.message).is.equalTo('New user created');
                assert.that(res.body.url).is.equalTo('/');
                done();
            });
        });

        it('fails to creates a new user', function(done) {
            request(app)
            .post('/api/NewUser')
            .send({'username': 'TestingUsername', 'password': 'password'})
            .expect(500)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                else {
                    assert.that(res.body.error).is.not.null();
                    done();
                }
            });
        });
    });

    describe('POST /ProfileUpdate', function() {
        it('updates a user profile', function(done) {
            request(app)
            .post('/api/ProfileUpdate')
            .send({'username': 'npeters3t', 'firstname': 'Nicole', 'lastname': 'Peters', 'city': 'Brandon', 'country': 'Canada', 'school': 'Red River College', 'courses': 'Distributed Systems', 'generalDescription': '', 'helpDescription': '', 'dateOfBirth': '5/13/1994'})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.message).is.not.null();
                assert.that(res.body.message).is.equalTo('User profile updated');
                assert.that(res.body.url).is.equalTo('/');

                request(app)
                .get('/api/getUser?user=npeters3t') // change to one of the users actually in the test db data
                .expect(200) 
                .expect('Content-Type', 'application/json; charset=utf-8') // self explanatory
                .end(function(err, res) {
                    if (err) done(err); // exit if there's an error
                    assert.that(res.body.user).is.not.null(); // assert the key 'user' is in the json response
                    assert.that(res.body.user.username).is.equalTo("npeters3t");
                    assert.that(res.body.user.firstname).is.equalTo("Nicole");
                    assert.that(res.body.user.lastname).is.equalTo("Peters");
                    assert.that(res.body.user.city).is.equalTo("Brandon");
                    done();
                });
            });
        });
    });

    describe('POST /login', function() {
        it('logins in a user', function(done) {
            request(app)
            .post('/api/login')
            .send({'username': 'KeaneKraus', 'password': 'kraus'})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.user).is.not.null();
                assert.that(res.body.user.username).is.equalTo('KeaneKraus');
                assert.that(res.body.url).is.equalTo('/main');
                done();
            });
        });

        it('fails logins in a user because of username', function(done) {
            request(app)
            .post('/api/login')
            .send({'username': 'MichaelMcDoesntExist', 'password': 'kraus'})
            .expect(500)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.message).is.not.null();
                assert.that(res.body.message).is.equalTo('Oops! Something went wrong. Invalid username/password.');
                done();
            });
        });

        it('fails logins in a user because of password', function(done) {
            request(app)
            .post('/api/login')
            .send({'username': 'KeaneKraus', 'password': 'this password'})
            .expect(500)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.message).is.not.null();
                assert.that(res.body.message).is.equalTo('Oops! Something went wrong. Invalid username/password.');
                done();
            });
        });
    });

    describe('GET /randomUser', function() {
        it('gets a random user', function(done) {
            request(app)
            .get('/api/randomUser')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.username).is.not.null();
                assert.that(res.body.userID).is.not.null();
                done();
            });
        });
    });

    describe ('GET /api/getPotentialMatches', function() {
        it('requests a list of users that are a match for a provided userID', function(done) {
            request(app)
            .get('/api/getPotentialMatches')
            .send({'userId': 1})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) done(err); // exit if there's an error
                assert.that(res.body.matches).is.not.null();
                assert.that(res.body.matches.length).is.equalTo(1);
                assert.that(res.body.matches[0].id).is.not.null();
                assert.that(res.body.matches[0].id).is.equalTo(2);
                done();
            });
        });
        it('requests a list of matches when none exist', function(done) {
            request(app)
            .get('/api/getPotentialMatches')
            .send({userId: 3})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.matches).is.not.null();
                assert.that(res.body.matches.length).is.equalTo(0);
                done();
            });
        });
    });

    describe('POST /api/likeUser', function() {
        it('creates a new \'like\' record', function(done) {
            request(app)
            .post('/api/likeUser')
            .send({liker_id: 10, likee_id: 20})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body).is.not.null();
                assert.that(res.body.liker_id).is.equalTo(10);
                assert.that(res.body.likee_id).is.equalTo(20);
                assert.that(res.body.likes).is.equalTo(true);
                done();
            })
        })
    });

    describe('POST /api/dislikeUser', function() {
        it('creates a new \'dislike\' record', function(done) {
            request(app)
            .post('/api/dislikeUser')
            .send({liker_id: 10, likee_id: 30})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body).is.not.null();
                assert.that(res.body.liker_id).is.equalTo(10);
                assert.that(res.body.likee_id).is.equalTo(30);
                assert.that(res.body.likes).is.equalTo(false);
                done();
            })
        })
    });
});
