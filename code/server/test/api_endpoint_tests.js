var app = require('../main.js');
var request = require('supertest');
var assert = require('assertthat');

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
          console.log(res.body);
          assert.that(res.body.users).is.not.null();
          //res.body.should.have.property('users');
          // res.body.username.should.have.property('username', 'npeters3t'); // change as appropriate
          //assert.equal(res.body.users.username, 'npeters3t');
          done();
      });
    });
  });
});
