var app = require('../main.js');
var request = require('supertest');
var assert = require('assertthat'); // View README for documentation https://github.com/thenativeweb/assertthat
var rating = require('../data_access/RatingDataAccess.js');

describe('Rating', function() {
    rating.init('stub');
    describe('Rating getRatings', function() {
    	it('get ratings for 222', function(done) {
    		rating.getRatings(222).then(function(data) {
    			assert.that(data).is.not.null();
    			assert.that(data.average).is.equalTo(2.5);
                assert.that(data.reviews.length).is.equalTo(2);
    			done();
    		});
    	});

    	it('get ratings for 111', function(done) {
    		rating.getRatings(111).then(function(data) {
    			assert.that(data).is.not.null();
                assert.that(data.average).is.equalTo(0);
    			assert.that(data.reviews.length).is.equalTo(0);
    			done();
    		});
    	});
    });

    describe('Rating getMyRatingFor', function() {
    	it('gets the rating a rater gave a ratee', function(done) {
    		rating.getMyRatingFor(205, 206).then(function(data) {
    			assert.that(data).is.not.null();
    			assert.that(data.rating).is.equalTo(5);
                assert.that(data.comment).is.equalTo('I totally rated you');
    			done();
    		});
    	});

    	it('gets the rating a rater gave a non-existant ratee', function(done) {
    		rating.getMyRatingFor(405, 111).then(function(data) {
    			assert.that(data).is.not.null();
                assert.that(data.rating).is.equalTo(0);
                assert.that(data.comment).is.equalTo('');
                done();
    		});
    	});
    });

    describe('Rating addRating', function() {
    	it('saves a rating', function(done) {
    		rating.addRating({'rating': 5, 'comment': 'msg'}).then(function(data) {
    			assert.that(data).is.not.null();
    			done();
    		});
    	});
    });

    describe('Rating removeUser', function() {
        it('remove user', function(done) {
            rating.removeUser(111).then(function(data) {
                assert.that(data).is.not.null();
                assert.that(data.length).is.equalTo(2);
                done();
            });
        });

        it('remove an non-existant user', function(done) {
            rating.removeUser(404).then(function(data) {
                assert.that(data).is.not.null();
                assert.that(data.length).is.equalTo(0);
                done();
            });
        });
    });
});