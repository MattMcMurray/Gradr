var UserMatchInterface = require('../interfaces/UserMatchInterface.js')
var Sequelize = require('sequelize');
var DBConnection = require('../database.js').sequelize;

var UserMatch = DBConnection.define('user_matches', {
    liker_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: false
    },
    likee_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: false
    },
    likes: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
});

function UserMatchDB() {
    UserMatch.sync();
}

UserMatchDB.prototype = new UserMatchInterface();
UserMatchDB.prototype.constructor = UserMatchDB;

UserMatchDB.prototype.addUserMatch = function(_liker_id, _likee_id, _likes) {
    return UserMatch.findOrCreate({
        where: {
            liker_id: _liker_id,
            likee_id: _likee_id
        },
        defaults: {
            likes: !!_likes
        }
    }).spread(function(result, created) {
        return result.dataValues;
    }).catch(function(errors) {
        console.log("ERROR: Sequelize errors occured while adding match for userIDs %d and %d", _liker_id, _likee_id);
        return { error: { name: errors.name, message: errors.message } };
    });
};

UserMatchDB.prototype.getMatches = function(userId) {
    return DBConnection.query(
        'SELECT um2.liker_id as userId FROM user_matches um2 WHERE um2.liker_id IN (SELECT um1.likee_id FROM user_matches um1 WHERE um1.liker_id = :userId AND um1.likes) AND um2.likee_id = :userId AND um2.likes',
        { replacements: { userId: userId }, type: DBConnection.QueryTypes.SELECT } ).then(function(users) {
            var ids = []
            for(var i=0; i < users.length; i++) {
                ids[i] = users[i].userId;
            }
            return ids;
    });
};

UserMatchDB.prototype.getPreviouslyRatedIds = function(userId) {
    return UserMatch.findAll({
        where: {
            liker_id: userId
        }
    }).then(function(users) {
        var ids = [];
        for(var i=0; i < users.length; i++) {
            ids[i] = users[i].likee_id;
        }
        return ids;
    });
};

UserMatchDB.prototype.removeUser = function(userId) {
    return UserMatch.destroy({
        where: {
            $or: {
                likee_id: userId,
                liker_id: userId
            }
        }
    });
}

module.exports = UserMatchDB;