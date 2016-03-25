// empty constructor
function UserMatchInterface() { }

UserMatchInterface.prototype = {
    addUserMatch: function(liker_id, likee_id, likes) {
        throw "function addUserMatch() not implemented";
    },
    getMatches: function(userID) {
        throw "function getMatches() not implemented";
    },
    getPreviouslyRatedIds: function(userID) {
        throw "function getPreviouslyRatedIds() not implemented";
    },
    removeUser: function(userID) {
    	throw "function removeUser() not implemented";
    },
    isMatch: function(liker_id, likee_id) {
        throw "function isMatch() not implemented";
    },
    getLeaders: function() {
        throw "function getLeader() not implemented";
    }
}

module.exports = UserMatchInterface;