var RatingInterface = require('../interfaces/RatingInterface.js')
var Sequelize = require('sequelize');
var DBConnection = require('../database.js').sequelize;

var Rating = DBConnection.define('ratings', {
    rater_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: false
    },
    ratee_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: false
    },
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    comment: {
        type: Sequelize.STRING,
    }
});

function RatingDB() {
    Rating.sync();
}

RatingDB.prototype = new RatingInterface();
RatingDB.prototype.constructor = RatingDB;

RatingDB.prototype.addRating = function(_rater_id, _ratee_id, _rating, _comment) {
    return Rating.upsert({
        rater_id: _rater_id,
        ratee_id: _ratee_id,
        rating: _rating,
        comment: _comment,
    }, {
        where: {
            rater_id: _rater_id,
            ratee_id: _ratee_id
        }
    }).then(function(result) {
        return true; //upsert returns undef if it succeeded. So we'll return true if the promise resolved successfully.
    }).catch(function(errors) {
        console.log("ERROR: Sequelize errors occured while adding rating for userIDs %d and %d", _rater_id, _ratee_id);
        return { error: { name: errors.name, message: errors.message } };
    });
};

//Returns an average rating and 10 rating-comment pairs
RatingDB.prototype.getRatings = function(_ratee_id) {
    return DBConnection.query(
        'SELECT comment, rating FROM ratings WHERE ratee_id = :rateeId',
        { replacements: { rateeId: _ratee_id }, type: DBConnection.QueryTypes.SELECT } ).then(function(ratings) {
            var avg = 0;
            var tenRatings = [];
            if (ratings.length > 0) {
                var sum = 0;
                var i;
                for (i = 0; i < ratings.length; i++) {
                    sum += ratings[i].rating;
                }
                avg = sum / ratings.length; 
                tenRatings = ratings.slice(0, Math.min(10, ratings.length));
            }

            return {
                average: avg,
                reviews: tenRatings
            };
    });
};

//Returns the rating and comment rater left for ratee
RatingDB.prototype.getMyRatingFor = function(_rater_id, _ratee_id) {
    return Rating.findOne({
        where:{
            rater_id: _rater_id,
            ratee_id: _ratee_id
        } 
    }).then(function(ratingEntry) {
        var rating = 0;
        var comment = '';
        if (ratingEntry) {
            rating = ratingEntry.rating;
            comment = ratingEntry.comment;
        }
        return {
            rating: rating, 
            comment: comment
        };
    });
};

RatingDB.prototype.removeUser = function(userId) {
    return Rating.destroy({
        where: {
            $or: {
                ratee_id: userId,
                rater_id: userId
            }
        }
    });
}

module.exports = RatingDB;