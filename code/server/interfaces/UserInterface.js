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
        throw "function getRandom() not implemented";
    },
    getRandomBatch: function(currUserID, size) {
        throw "function getRandomBatch() not implemented"
    },
    removeUser: function(userID) {
        throw "function removeUser() not implemented";
    },
    getTheme: function(userID) {
        throw "function getTheme() not implemented";
    },
    setTheme: function(userID, theme) {
        throw "function setTheme() not implemented";
    }
}

module.exports = UserInterface;