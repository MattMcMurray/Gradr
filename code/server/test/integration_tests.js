var app = require('../main.js');
var request = require('supertest');
var assert = require('assertthat'); // View README for documentation https://github.com/thenativeweb/assertthat

//////////////////////////////////////////////////
// ALL INTEGRATION TESTS SHOULD GO IN THIS FILE // 
//////////////////////////////////////////////////
var username = "mynewusername";
var password = "hunter2";
var wrongPassword = "drowssap";

describe('api', function() {
    describe('GET /api/getUser', function() {
        it('Create valid user and log in', function(done) {
            // first make a request with mismatching passwords to make sure server responds appropriately
            request(app)
            .post('/api/newUser')
            .type('form')
            .send({'username': username, 'password': password, 'confirmPassword': wrongPassword})
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8') // self explanatory
            .end(function(err, res) {
                if (err) done(err);
                assert.that(res.body.msg).is.equalTo('Passwords do not match');
                done();
            });

            request(app)
            .post('/api/newUser')
            .type('form')
            .send({'username': username, 'password': password, 'confirmPassword': password})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8') // self explanatory
            .end(function(err, res) {
                if (err) done(err);
                // assert.that(res.body.msg).is.equalTo('Passwords do not match');
                assert.that(res.body.url).is.equalTo('/');
                assert.that(res.body.message).is.equalTo('New user created');
                done();
            });

//      .get('/api/getUser?user=npeters3t') // change to one of the users actually in the test db data
//      .expect(200) 
//      .expect('Content-Type', 'application/json; charset=utf-8') // self explanatory
//      .end(function(err, res) {
//        if (err) done(err); // exit if there's an error
//          assert.that(res.body.user).is.not.null(); // assert the key 'user' is in the json response
//          assert.that(res.body.user.username).is.equalTo("npeters3t");
//          assert.that(res.body.user.firstname).is.equalTo("Nicole");
//          assert.that(res.body.user.lastname).is.equalTo("Peters");
//          assert.that(res.body.user.city).is.equalTo("Dauphin");
//          done();
//      });
        });
    });
});
