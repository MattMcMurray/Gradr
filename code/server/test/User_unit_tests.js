var app = require('../main.js');
var request = require('supertest');
var assert = require('assertthat'); // View README for documentation https://github.com/thenativeweb/assertthat
var user = require('../models/User.js');

describe('User', function() {
  describe('User getUser', function() {
    it('requests a user', function(done) {
      user.getUser('npeters3t').then(function(data) {
        assert.that(data).is.not.null();
        assert.that(data.username).is.equalTo('npeters3t');
        assert.that(data.firstname).is.equalTo('Nicole');
        assert.that(data.lastname).is.equalTo('Peters');
        done();
      });
    });

    it('requests a user that doesn\'t exists', function(done) {
      user.getUser('MichaelMcDoesntExist').then(function(data) {
        assert.that(data).is.null();
        done();
      });
    });
  });

  describe('User getUsersById', function() {
    it('requests a list of users', function(done) {
      user.getUsersById([337, 400]).then(function(data) {
        assert.that(data).is.not.null();
        assert.that(data.length).is.equalTo(2);
        //add asserts to verify user data after stubs are added
        done();
      });
    });

    it('requests a list of users but doesn\'t use ids', function(done) {
      user.getUsersById([]).then(function(data) {
        assert.that(data).is.not.null();
        assert.that(data.length).is.equalTo(0);
        //add asserts to verify user data after stubs are added
        done();
      });
    });
  });

  describe('User getAllUsers', function() {
    it('requests a list of all users', function(done) {
      user.getAllUsers().then(function(data) {
        assert.that(data).is.not.null();
        //for stubs
        //assert.that(data.length).is.equalTo();
        done();
      });
    });
  });

  describe('User createUser', function() {
    it('creates a new user', function(done) {
      user.createUser({'username': 'Testing', 'password': 'password'}).then(function(data) {
        assert.that(data).is.not.null();
        assert.that(data.username).is.equalTo('Testing');
        assert.that(data.password).is.not.equalTo('password');
        done();
      });
    });
  });

  describe('User createUserProfile', function() {
    it('fills out a profile fields', function(done) {
      user.createUserProfile({}).then(function(data) {
        assert.that()
      })
    })
  })
});

/*
var getUsersById = function(ids) {
    return UserConnection.findAll({
        where:{
            id: ids
        }
    });
}*/