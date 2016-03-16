var app = require('../main.js');
var request = require('supertest');
var assert = require('assertthat'); // View README for documentation https://github.com/thenativeweb/assertthat
var api = require('../routes/api.js');
var stubUser = require('../data_access/UserDataAccess.js');
var stubLikes = require('../data_access/UserMatchDataAccess.js');
var stubRating = require('../data_access/RatingDataAccess.js');
//////////////////////////////////////////
// ALL API TESTS SHOULD GO IN THIS FILE // 
//////////////////////////////////////////

describe('api', function() {
    stubUser.init('stub');
    stubLikes.init('stub');
    stubRating.init('stub');
    // This is just a description, not the actual route the test will use
    describe('GET /api/getUser', function() {
        it('requests a user from the api', function(done) {
            request(app)
            .get('/api/getUser?user=mattmcmurray') // change to one of the users actually in the test db data
            .expect(200) 
            .expect('Content-Type', 'application/json; charset=utf-8') // self explanatory
            .end(function(err, res) {
                if (err) done(err); // exit if there's an error
                assert.that(res.body.user).is.not.null(); // assert the key 'user' is in the json response
                assert.that(res.body.user.username).is.equalTo("mattmcmurray");
                assert.that(res.body.user.firstname).is.equalTo("matt");
                assert.that(res.body.user.lastname).is.equalTo("mcmurray");
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
            .expect(400)
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
            .send({'username': 'mattmcmurray', 'firstname': 'matt', 'lastname': 'mcmurray', 'city': 'Brandon', 'country': 'Canada', 'school': 'Red River College', 'courses': 'Distributed Systems', 'generalDescription': '', 'helpDescription': '', 'dateOfBirth': null})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.message).is.not.null();
                assert.that(res.body.message).is.equalTo('User profile updated');
                assert.that(res.body.url).is.equalTo('/');

                request(app)
                .get('/api/getUser?user=mattmcmurray') // change to one of the users actually in the test db data
                .expect(200) 
                .expect('Content-Type', 'application/json; charset=utf-8') // self explanatory
                .end(function(err, res) {
                    if (err) done(err); // exit if there's an error
                    assert.that(res.body.user).is.not.null(); // assert the key 'user' is in the json response
                    assert.that(res.body.user.username).is.equalTo("mattmcmurray");
                    assert.that(res.body.user.firstname).is.equalTo("matt");
                    assert.that(res.body.user.lastname).is.equalTo("mcmurray");
                    assert.that(res.body.user.city).is.equalTo("Brandon");
                    done();
                });
            });
        });
    });

    // describe('POST /login', function() {

    //     it('logins in a user', function(done) {
    //         request(app)
    //         .post('/api/login')
    //         .send({'username': 'jjorell', 'password': 'hello1'})
    //         .expect(200)
    //         .expect('Content-Type', 'application/json; charset=utf-8')
    //         .end(function(err, res) {
    //             if(err) done(err);
    //             assert.that(res.body.user).is.not.null();
    //             assert.that(res.body.user.username).is.equalTo('jjorell');
    //             assert.that(res.body.url).is.equalTo('/main');
    //             done();
    //         });
    //     });

    //     it('fails logins in a user because of username', function(done) {
    //         request(app)
    //         .post('/api/login')
    //         .send({'username': 'MichaelMcDoesntExist', 'password': 'kraus'})
    //         .expect(500)
    //         .expect('Content-Type', 'application/json; charset=utf-8')
    //         .end(function(err, res) {
    //             if(err) done(err);
    //             assert.that(res.body.message).is.not.null();
    //             assert.that(res.body.message).is.equalTo('Oops! Something went wrong. Invalid username/password.');
    //             done();
    //         });
    //     });

    //     it('fails logins in a user because of password', function(done) {
    //         request(app)
    //         .post('/api/login')
    //         .send({'username': 'jjorell', 'password': 'this password'})
    //         .expect(500)
    //         .expect('Content-Type', 'application/json; charset=utf-8')
    //         .end(function(err, res) {
    //             if(err) done(err);
    //             assert.that(res.body.message).is.not.null();
    //             assert.that(res.body.message).is.equalTo('Oops! Something went wrong. Invalid username/password.');
    //             done();
    //         });
    //     });
    // });

    describe('GET /randomUser', function() {
        it('gets a random user', function(done) {
            request(app)
            .get('/api/randomUser')
            .send({'currUserId': 1})
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

    describe('GET /userBatch', function() {
        it('gets a random set of users', function(done) {
            request(app)
            .get('/api/userBatch?currUserId=1&batchSize=10')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.users).is.not.null();
                assert.that(res.body.users.length).is.not.equalTo(3); //Because we're using the stub
                done();
            });
        });
    });

    describe ('GET /api/getPotentialMatches', function() {
        it('requests a list of users that are a match for a provided userID', function(done) {
            request(app)
            .get('/api/getPotentialMatches?userId=111')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) done(err); // exit if there's an error
                assert.that(res.body.matches).is.not.null();
                assert.that(res.body.matches.length).is.equalTo(1);
                assert.that(res.body.matches[0].id).is.not.null();
                assert.that(res.body.matches[0].id).is.equalTo(222);
                done();
            });
        });
        it('requests a list of matches when none exist', function(done) {
            request(app)
            .get('/api/getPotentialMatches?userId=3')
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
        it('creates a new \'like\' record with two different, valid ids', function(done) {
            request(app)
            .post('/api/likeUser')
            .send({liker_id: 111, likee_id: 333})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body).is.not.null();
                assert.that(res.body.liker_id).is.equalTo(111);
                assert.that(res.body.likee_id).is.equalTo(333);
                assert.that(res.body.likes).is.equalTo(true);
                done();
            });
        });

        it('creates a new \'like\' record with empty ids', function(done) {
            request(app)
            .post('/api/likeUser')
            .send({liker_id: null, likee_id: null})
            .expect(500)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.error).is.not.null();
                done();
            });
        });

        it('creates a new \'like\' record with non-existant ids', function(done) {
            request(app)
            .post('/api/likeUser')
            .send({liker_id: -1, likee_id: -2})
            .expect(500)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.error).is.not.null();
                done();
            });
        });

        it('creates a new \'like\' record with non-numerical ids', function(done) {
            request(app)
            .post('/api/likeUser')
            .send({liker_id: 'liker', likee_id: 'likee'})
            .expect(500)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.error).is.not.null();
                done();
            });
        });
    });

    describe('POST /api/dislikeUser', function() {
        it('creates a new \'dislike\' record with two different, valid ids', function(done) {
            request(app)
            .post('/api/dislikeUser')
            .send({liker_id: 111, likee_id: 444})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body).is.not.null();
                assert.that(res.body.liker_id).is.equalTo(111);
                assert.that(res.body.likee_id).is.equalTo(444);
                assert.that(res.body.likes).is.equalTo(false);
                done();
            });
        });

        it('creates a new \'dislike\' record with empty ids', function(done) {
            request(app)
            .post('/api/dislikeUser')
            .send({liker_id: null, likee_id: null})
            .expect(500)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.error).is.not.null();
                done();
            });
        });

        it('creates a new \'like\' record with non-existant ids', function(done) {
            request(app)
            .post('/api/dislikeUser')
            .send({liker_id: -1, likee_id: -2})
            .expect(500)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.error).is.not.null();
                done();
            });
        });

        it('creates a new \'like\' record with non-numerical ids', function(done) {
            request(app)
            .post('/api/dislikeUser')
            .send({liker_id: 'liker', likee_id: 'likee'})
            .expect(500)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.error).is.not.null();
                done();
            });
        });
    });

    describe('POST /api/rateUser', function() {
        it('inserts a new rating record', function(done) {
            request(app)
            .post('/api/rateUser')
            .send({rater_id: 222, ratee_id: 111, rating: 3, comment:"OK"})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body).is.not.null(); //If there's no error, we deem it successful
                done();
            });
        });

        it('makes us rate someone we haven\'t matched with', function(done) {
            request(app)
            .post('/api/rateUser')
            .send({rater_id: 222, ratee_id: 444, rating: 5, comment:"I don't even know you"})
            .expect(401)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.error).is.not.null();
                done();
            });
        });

        it('try to rate with incorrect parameters', function(done) {
            request(app)
            .post('/api/rateUser')
            .send({rater_id: null, ratee_id: null, rating: 5, comment:""})
            .expect(401)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.error).is.not.null();
                done();
            });
        });
    });

    describe('GET /api/getMyRatingFor', function() {
        it('get a rating that already exists', function(done) {
            request(app)
            .get('/api/getMyRatingFor?rater_id=111&ratee_id=222')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body).is.not.null();
                assert.that(res.body).is.not.null();
                assert.that(res.body.rating).is.equalTo(5);
                assert.that(res.body.comment).is.equalTo("I totally rated you");
                done();
            });
        });

        it('get a rating that doesn\'t exist', function(done) {
            request(app)
            .get('/api/getMyRatingFor?rater_id=222&ratee_id=111')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body).is.not.null();
                assert.that(res.body.rating).is.equalTo(0);
                assert.that(res.body.comment).is.equalTo('');
                done();
            });
        });

        it('get a rating with invalid parameters', function(done) {
            request(app)
            .get('/api/getMyRatingFor?rater_id=\'lala\'&ratee_id=nop')
            .expect(401)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                assert.that(res.body.error).is.not.null();
                done();
            });
        });
    });

    describe('GET /api/getRatings', function() {
        it('get an average rating for a user', function(done) {
            request(app)
            .get('/api/getRatings?ratee_id=222')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body).is.not.null();
                assert.that(res.body.average).is.equalTo(2.5);
                assert.that(res.body.reviews).is.not.null();
                assert.that(res.body.reviews.length).is.equalTo(2);
                done();
            });
        });

        it('get an average rating with no parameters', function(done) {
            request(app)
            .get('/api/getRatings')
            .expect(401)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                assert.that(res.body).is.not.null();
                assert.that(res.body.error).is.not.null();
                done();
            });
        });
    });

    describe('POST /api/deleteUser', function() {
        it('deletes a user', function(done) {
            request(app)
            .post('/api/deleteUser')
            .send({'userId': 111})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.url).is.equalTo('/');
                done();
            });
        });

        it('verifies a user is deleted', function(done) {
            request(app)
            .get('/api/getUser?user=bairosns')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if(err) done(err);
                assert.that(res.body.user).is.null();
                done();
            });
        });
    });
});
