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
  });

  // PUT NEXT API TESTS HERE:

    describe ('GET /api/getPotentialMatches', function() {
        it('requests a list of users that are a match for a provided userID', function(done) {
            var agent = request(app);
            agent
            .post('/api/likeUser')
            .send({ liker_id: 1, likee_id: 2})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(done) {
                agent
                .post('/api/likeUser')
                .send({ liker_id: 2, likee_id: 1})
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(done) {
                    agent
                    .get('/api/getPotentialMatches')
                    .send({'userId': 1})
                    .expect(200)
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .end(function(err, res) {
                        if (err) done(err); // exit if there's an error
                        assert.that(res.body.matches).is.not.null();
                        assert.that(res.body.matches.length).is.equalTo(1);
                        done();
                    });
                });
                done();
            }); 
            done();
        });
    });

  // describe('GET /api/blah', function(){
  //    it('say what it does here', function() {
  //
  //      // assertions go here
  //
  //    });
  // });
});
