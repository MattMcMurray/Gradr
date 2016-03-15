var app = require('../main.js');
var request = require('supertest');
var assert = require('assertthat'); // View README for documentation https://github.com/thenativeweb/assertthat
var user = require('../data_access/UserDataAccess.js');

describe('User', function() {
    user.init('stub');
    describe('User getUser', function() {
        it('requests a user', function(done) {
            user.getUser('bairosns').then(function(data) {
                assert.that(data).is.not.null();
                assert.that(data.dataValues.username).is.equalTo('bairosns');
                assert.that(data.dataValues.firstname).is.equalTo('steve');
                assert.that(data.dataValues.lastname).is.equalTo('bairosns');
                done();
            });
        });

        it('requests a user that doesn\'t exists', function(done) {
            user.getUser('MichaelMcDoesntExist').then(function(data) {
                assert.that(data.dataValues).is.null();
                done();
            });
        });
    });

    describe('User getUsersById', function() {
        it('requests a list of users', function(done) {
            user.getUsersById([111, 222]).then(function(data) {
                assert.that(data).is.not.null();
                assert.that(data.length).is.equalTo(2);
                assert.that(data[0].username).is.equalTo('bairosns');
                assert.that(data[1].username).is.equalTo('mattmcmurray');
                done();
            });
        });

        it('requests a list of users but doesn\'t use ids', function(done) {
            user.getUsersById([]).then(function(data) {
                assert.that(data).is.not.null();
                assert.that(data.length).is.equalTo(0);
                done();
            });
        });

        it('requests a list of users but uses mixed ids', function(done) {
            user.getUsersById([111, 404]).then(function(data) {
                console.log(data);
                assert.that(data).is.not.null();
                assert.that(data.length).is.equalTo(1);
                done();
            });
        });
    });

    describe('User getAllUsers', function() {
        it('requests a list of all users', function(done) {
            user.getAllUsers().then(function(data) {
                assert.that(data.dataValues).is.not.null();
                assert.that(data.dataValues.length).is.atLeast(2);
                done();
            });
        });
    });

    describe('User createUser', function() {
        it('creates a new user', function(done) {
            user.createUser({'username': 'Testing', 'password': 'password'}).then(function(data) {
                assert.that(data.dataValues).is.not.null();
                assert.that(data.dataValues.username).is.equalTo('Testing');
                assert.that(data.dataValues.password).is.not.equalTo('password');
                done();
            });
        });
    });

    describe('User createUserProfile', function() {
        it('fills out a profile fields', function(done) {
            user.createUserProfile({'username':'bairosns', 'firstname': 'steve', 'lastname': 'bairosns' , 'city': 'Winnipeg', 'country': 'Canada', 'school': 'uofm', 'courses': '4350', 'generalDescription': 'test', 'helpDescription': 'test', 'dateOfBirth': null});
            user.getUser('bairosns').then(function(data) {
                assert.that(data.dataValues).is.not.null();
                assert.that(data.dataValues.username).is.equalTo('bairosns');
                assert.that(data.dataValues.firstname).is.equalTo('steve');
                assert.that(data.dataValues.lastname).is.equalTo('bairosns');
                assert.that(data.dataValues.country).is.equalTo('Canada');
                assert.that(data.dataValues.school).is.equalTo('uofm');
                assert.that(data.dataValues.courses).is.equalTo('4350');
                assert.that(data.dataValues.generalDescription).is.equalTo('test');
                assert.that(data.dataValues.helpDescription).is.equalTo('test');
                assert.that(data.dataValues.city).is.equalTo('Winnipeg');
                assert.that(data.dataValues.dateOfBirth).is.null();
                done();
            });
        });
    });

    describe('User getRandom', function() {
        it('gets a random user', function(done) {
            user.getRandom(111).then(function(data) {
                assert.that(data.dataValues).is.not.null();
                assert.that(data.dataValues.username).is.equalTo('calebmueller');
                done();
            });
        });

        it('gets a different random user', function(done) {
            user.getRandom(222).then(function(data) {
                assert.that(data.dataValues).is.not.null();
                assert.that(data.dataValues.username).is.equalTo('mattmcmurray');
                done();
            });
        });
    });

    describe('User getRandomBatch', function() {
        it('gets a random set of users', function(done) {
            user.getRandomBatch(111, 2).then(function(data) {
                assert.that(data).is.not.null();
                assert.that(data.length).is.equalTo(2);
                done();
            });
        });

        it('gets a different random set of users', function(done) {
            user.getRandomBatch(444,1).then(function(data) {
                assert.that(data).is.not.null();
                assert.that(data.length).is.equalTo(3);
                done();
            });
        });
    });

    describe('User removeUser', function() {
        it('removes a user', function(done) {
            user.removeUser(333).then(function(data) {
                assert.that(data).is.not.null();
                assert.that(data.id).is.equalTo(333);
                done();
            });
        });

        it('removes an non-existant user', function(done) {
            user.removeUser(404).then(function(data) {
                assert.that(data).is.null();
                done();
            });
        });
    });

    describe('User getTheme', function() {
        it('gets a theme integer from a user', function(done) {
            user.getTheme(111).then(function(data) {
                assert.that(data).is.not.null();
                assert.that(data.dataValues.theme).is.equalTo(2);
                done();
            });
        });
    });

    describe('User setTheme', function() {
        it('sets a theme for a user', function(done) {
            user.setTheme(222, 4).then(function(data) {
                user.getTheme(222).then(function(data) {
                    assert.that(data).is.not.null();
                    assert.that(data.dataValues.theme).is.equalTo(4);
                    done();
                });
            });
        });
    });
});
