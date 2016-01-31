var Sequelize = require("sequelize");
var connection = require("../database.js");
var User = require("./User.js");

UserMatches = connection.define('user_matches', {
    liker_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: User.model,
            key: 'id'
        },
        allowNull: false
    },
    likee_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: User.model,
            key: 'id'
        },
        allowNull: false
    },
    likes: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
});

// UserMatches.sync();

var addUserMatch = function(_liker_id, _likee_id, _likes) {
    UserMatches.findOrCreate({
        where: {
            liker_id: _liker_id,
            likee_id: _likee_id
        },
        defaults: {
            likes: !!_likes
        }
    }).spread(function(result, created) {
        // console.log(result);
        // console.log(created);
    }).catch(function(errors) {
        console.log("ERROR: Sequelize errors occured while adding match for userIDs %d and %d", 
                _liker_id, _likee_id);
    });
};

module.exports = {
    addUserMatch: addUserMatch
};