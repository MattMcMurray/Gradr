var app = require('../main.js');
var request = require('supertest');
var assert = require('assertthat'); // View README for documentation https://github.com/thenativeweb/assertthat
var message = require('../data_access/MessagesDataAccess.js');

describe('Message', function() {
    message.init('stub');
    describe('Message getMessages', function() {
    	it('get messages from sender to receiver', function(done) {
    		message.getMessages(205, 206).then(function(messages) {
    			assert.that(messages).is.not.null();
    			console.log(messages);
    			assert.that(messages.length).is.equalTo(2);
    			done();
    		});
    	});

    	it('get messages from sender to receiver 2', function(done) {
    		message.getMessages(206, 205).then(function(messages) {
    			assert.that(messages).is.not.null();
    			assert.that(messages.length).is.equalTo(1);
    			done();
    		});
    	});
    });

    describe('Message getAllMessages', function() {
    	it('gets all messages associated with sender and receiver', function(done) {
    		message.getAllMessages(205, 206).then(function(messages) {
    			assert.that(messages).is.not.null();
    			assert.that(messages.length).is.equalTo(3);
    			done();
    		});
    	});

    	it('gets all messages associated with non-existant sender and receiver', function(done) {
    		message.getAllMessages(405, 206).then(function(messages) {
    			assert.that(messages).is.not.null();
    			assert.that(messages.length).is.equalTo(0);
    			done();
    		});
    	});

		it('gets all messages associated with sender and non-existant receiver', function(done) {
    		message.getAllMessages(205, 406).then(function(messages) {
    			assert.that(messages).is.not.null();
    			assert.that(messages.length).is.equalTo(0);
    			done();
    		});
    	});

    	it('gets all messages associated with non-existant sender and non-existant receiver', function(done) {
    		message.getAllMessages(405, 404).then(function(messages) {
    			assert.that(messages).is.not.null();
    			assert.that(messages.length).is.equalTo(0);
    			done();
    		});
    	});
    	
    });

    describe('Message saveMessage', function() {
    	it('saves message', function(done) {
    		message.saveMessage({'message': 'msg'}).then(function(message) {
    			assert.that(message).is.not.null();
    			done();
    		});
    	});
    });
});