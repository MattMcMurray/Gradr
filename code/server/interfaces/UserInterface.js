// empty constructor
function UserInterface() { }

UserInterface.prototype = {
    getUser: function(username) {
        throw "function getUser() not implemented";
    },
    getUsersByID: function(userIDs) {
        throw "function getUsersByID() not implemented";
    },
    getAllUsers: function() {
        throw "function getAllUsers() not implemented";
    },
    createUser: function(userData) {
        throw "function createUser() not implemented";
    },
    createUserProfile: function(userData) {
        throw "function createUserProfile() not implemented";
    },
    getRandom: function(currUserID) {
        throw "function getRandom() not implemeneted";
    }
}

module.exports = UserInterface;