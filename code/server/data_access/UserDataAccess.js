var UserDB = require('../models/UserDB.js');
var UserStub = require('../stubs/UserStub.js');

var userDAO;

var init = function(mode) {
    if (mode == 'stub')
        userDAO = new UserStub();
    else if (mode == 'db')
        userDAO = new UserDB();
    else
        throw '\'' + mode + '\' is not a valid mode. Use \'db\' or \'stub\'.'
}

var getUser = function(username) {
    return userDAO.getUser(username);
}

var getUsersById = function(ids) {
    return userDAO.getUsersById(ids);
}

var getAllUsers = function() {
    return userDAO.getAllUsers();
}

var createUser = function(userData) {
    return userDAO.createUser(userData);
}

var createUserProfile = function(userData) {
    return userDAO.createUserProfile(userData);
}

var getRandom = function(currUserID) {
    return userDAO.getRandom(currUserID);
}

module.exports = {
    init: init,
    getUser: getUser,
    getUsersById: getUsersById,
    createUser: createUser,
    getRandom: getRandom,
    getAllUsers: getAllUsers,
    createUserProfile:createUserProfile
}