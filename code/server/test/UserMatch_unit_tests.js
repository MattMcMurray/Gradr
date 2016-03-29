var app = require('../main.js');
var request = require('supertest');
var assert = require('assertthat'); // View README for documentation https://github.com/thenativeweb/assertthat
var userMatch = require('../data_access/UserMatchDataAccess.js');

describe('UserMatch', function() {
    userMatch.init('stub');
    describe('UserMatch addUserMatch', function() {
        it('adds a like record', function(done) {
        	userMatch.addUserMatch(111, 555, true).then(function(data) {
        		assert.that(data).is.not.null();
        		assert.that(data.liker_id).is.equalTo(111);
        		assert.that(data.likee_id).is.equalTo(555);
        		assert.that(data.likes).is.equalTo(true);
        		done();
        	});
        });

        it('adds a dislike record', function(done) {
			userMatch.addUserMatch(111, 333, false).then(function(data) {
        		assert.that(data).is.not.null();
        		assert.that(data.liker_id).is.equalTo(111);
        		assert.that(data.likee_id).is.equalTo(333);
        		assert.that(data.likes).is.equalTo(false);
        		done();
        	});
        });

        it('adds a record with an non-existant likee id', function(done) {
        	userMatch.addUserMatch(111, 404, false).then(function(data) {
        		assert.that(data.error).is.not.null();
        		assert.that(data.error.name).is.equalTo('UserMatchesError');
        		assert.that(data.error.message).is.equalTo('Unable to save UserMatch for users 111 and 404');
        		done();
        	});
        });

        it('adds a record with an non-existant liker id', function(done) {
        	userMatch.addUserMatch(404, 222, true).then(function(data) {
        		assert.that(data.error).is.not.null();
        		assert.that(data.error.name).is.equalTo('UserMatchesError');
        		assert.that(data.error.message).is.equalTo('Unable to save UserMatch for users 404 and 222');
        		done();
        	});
        });

        it('adds a record with an non-numeric likee id', function(done) {
        	userMatch.addUserMatch(111, 'broken', false).then(function(data) {
        		assert.that(data.error).is.not.null();
        		assert.that(data.error.name).is.equalTo('UserMatchesError');
        		assert.that(data.error.message).is.equalTo('Unable to save UserMatch for users 111 and broken');
        		done();
        	});
        });

        it('adds a record with an non-numeric liker id', function(done) {
        	userMatch.addUserMatch('broken', 222, true).then(function(data) {
        		assert.that(data.error).is.not.null();
        		assert.that(data.error.name).is.equalTo('UserMatchesError');
        		assert.that(data.error.message).is.equalTo('Unable to save UserMatch for users broken and 222');
        		done();
        	});
        });
    });

    describe('UserMatch getMatches', function() {
    	it('grabs all doubly matched pairs for 111', function(done) {
    		userMatch.getMatches(111).then(function(data) {
    			assert.that(data).is.not.null();
    			assert.that(data[0]).is.equalTo(222);
    			assert.that(data.length).is.equalTo(1);
    			done();
    		});
    	});

    	it('grabs all doubly matched pairs for 333', function(done) {
    		userMatch.getMatches(333).then(function(data) {
    			assert.that(data).is.not.null();
    			assert.that(data.length).is.equalTo(0);
    			done();
    		});
    	});

    	it('grabs all doubly matched pairs for non-existant id', function(done) {
    		userMatch.getMatches(404).then(function(data) {
    			assert.that(data).is.not.null();
    			assert.that(data.length).is.equalTo(0);
    			done();
    		});
    	});
    });

    describe('UserMatch isMatch', function() {
        it('determines if the liker and likee has a positive match', function(done) {
            userMatch.isMatch(111,222).then(function(data) {
                assert.that(data).is.not.null();
                assert.that(data).is.equalTo(true);
                done();
            });
        });
        it('determines if the liker and likee has a negative match', function(done) {
            userMatch.isMatch(333,222).then(function(data) {
                assert.that(data).is.not.null();
                assert.that(data).is.equalTo(false);
                done();
            });
        });
        it('determines if there is a match with non-existant liker_id', function(done) {
            userMatch.isMatch(404, 222).then(function(data) {
                assert.that(data).is.not.null();
                assert.that(data).is.equalTo(false);
                done();
            });
        });
        it('determines if there is a match with non-existant likee_id', function(done) {
            userMatch.isMatch(222, 404).then(function(data) {
                assert.that(data).is.not.null();
                assert.that(data).is.equalTo(false);
                done();
            });
        });
        it('determines if there is a match with non-existant ids', function(done) {
            userMatch.isMatch(404, 405).then(function(data) {
                assert.that(data).is.not.null();
                assert.that(data).is.equalTo(false);
                done();
            });
        });
        
    });

    describe('UserMatch getPreviouslyRatedIds', function() {
    	it('get rated ids for 111', function(done) {
    		userMatch.getPreviouslyRatedIds(111).then(function(data) {
    			assert.that(data).is.not.null();
    			assert.that(data.length).is.equalTo(3);
    			assert.that(data[0]).is.equalTo(222);
    			assert.that(data[1]).is.equalTo(555);
    			assert.that(data[2]).is.equalTo(333);
    			done();
    		});
    	});

    	it('get rated ids for non-existant id', function(done) {
    		userMatch.getPreviouslyRatedIds(404).then(function(data) {
    			assert.that(data).is.not.null();
    			assert.that(data.length).is.equalTo(0);
    			done();
    		});
    	});
    });

    describe('UserMatch removeUser', function() {
        it('remove user', function(done) {
            userMatch.removeUser(111).then(function(data) {
                assert.that(data).is.not.null();
                assert.that(data.length).is.equalTo(6);
                done();
            });
        });

        it('remove an non-existant user', function(done) {
            userMatch.removeUser(404).then(function(data) {
                assert.that(data).is.not.null();
                assert.that(data.length).is.equalTo(0);
                done();
            });
        });
    });

    describe('UserMatch getLeaders', function() {
        it('get leaders', function(done) {
            userMatch.getLeaders().then(function(data) {
                assert.that(data).is.not.null();
                assert.that(data.length).is.not.equalTo(0);
                done();
            });
        });
    });
});
