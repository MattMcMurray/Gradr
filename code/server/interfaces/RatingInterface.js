// empty constructor
function RatingInterface() { }

RatingInterface.prototype = {
    addRating: function(raterId, rateeId, rating, comment) {
        throw "function addRating() not implemented";
    },
    getRatings: function(rateeId) {
        throw "function getRatings() not implemented";
    },
    getMyRatingFor: function(raterId, rateeId) {
        throw "function getMyRatingFor() not implemented";
    }
}

module.exports = RatingInterface;