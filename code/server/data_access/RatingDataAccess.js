var RatingDB = require('../models/RatingDB.js');
var RatingStub = require('../stubs/RatingStub.js');

var ratingDAO;

var init = function(mode) {
    if (mode == 'stub')
        ratingDAO = new RatingStub();
    else if (mode == 'db')
        ratingDAO = new RatingDB();
    else
        throw '\'' + mode + '\' is not a valid mode. Use \'db\' or \'stub\'.'
}

var addRating = function(_rater_id, _ratee_id, _rating, _comment) {
    return ratingDAO.addRating(_rater_id, _ratee_id, _rating, _comment);
}

var getRatings = function(ratee_id) {
    return ratingDAO.getRatings(ratee_id);
}

var getMyRatingFor = function (rater_id, ratee_id) {
    return ratingDAO.getMyRatingFor(rater_id, ratee_id);
}

module.exports = {
    init: init,
    addRating: addRating,
    getRatings: getRatings,
    getMyRatingFor: getMyRatingFor,
}