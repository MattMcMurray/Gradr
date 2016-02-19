var RatingInterface = require('../interfaces/RatingInterface.js');

var ratings, users;

function RatingStub() {
    ratings = [
        {rating: 1, comment: 'Hello'},
        {rating: 5, comment: 'Goodbye'},
    ];
}

RatingStub.prototype = new RatingInterface();
RatingStub.prototype.constructor = RatingStub;

//We claim to add it to the DB.
RatingStub.prototype.addRating = function(rater_id, ratee_id, rating, comment) {
    return new Promise(function(resolve) {
        resolve(true);
    });
};

//Will return 2 ratings with a 2.5 average except when the ratee is 111, then we assume they have no ratings
RatingStub.prototype.getRatings = function(rateeId) {

    var results = {
        average: 2.5,
        reviews: ratings
    }
    if (rateeId == 111) {
        results.average = 0;
        results.reviews = [];
    }

    return new Promise(function(resolve, reject) {
        resolve(results);
    });
};

//You gave them 5/5 hooray! Unless they're 1, then you didn't rate them
RatingStub.prototype.getMyRatingFor = function(raterId, rateeId) {
    var results = {
        rating: 5,
        comment: 'I totally rated you'
    }
    if (rateeId == 111) { //Special case where we want to pretend like the rating doesn't exist
        results.rating = 0;
        results.comment = '';
    }
    return new Promise(function(resolve, reject) {
        resolve(results);
    });
};


module.exports = RatingStub;