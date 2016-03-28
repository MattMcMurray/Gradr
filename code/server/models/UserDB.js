var UserInterface = require('../interfaces/UserInterface.js');
var Sequelize = require('sequelize');
var DBConnection = require('../database.js').sequelize;
var authenticator = require('../mixins/authenticator.js');
var UserMatchDAO = require('../data_access/UserMatchDataAccess.js');

var User = DBConnection.define('users', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    firstname: {
        type: Sequelize.STRING
    }, 
    lastname: {
        type: Sequelize.STRING
    }, 
    city: {
        type: Sequelize.STRING
    }, 
    country: {
        type: Sequelize.STRING
    }, 
    school: {
        type: Sequelize.STRING
    }, 
    courses: {
        type: Sequelize.STRING
    }, 
    //A string for information not captured by the other fields.
    generalDescription: {
        type: Sequelize.STRING
    }, 
    //A string for describing what courses/subject you are looking for help with
    helpDescription: {
        type: Sequelize.STRING
    }, 
    dateOfBirth: {
        type: Sequelize.DATE
    },
    theme: {
        type: Sequelize.INTEGER
    }
});

// Sync model with DB when initialized
function UserDB() {
	User.sync();
}

UserDB.prototype = new UserInterface();
UserDB.prototype.constructor = UserDB;

UserDB.prototype.getUser = function(username) {
    return User.findOne({
        where:{
            username: username
        }
    });	
};

UserDB.prototype.getUsersById = function(userIDs) {
    return User.findAll({
        attributes: ['username', 'firstname', 'lastname'],
        where:{
            id: userIDs
        }
    });
};

UserDB.prototype.getAllUsers = function() {
    return User.findAll();
};

UserDB.prototype.createUser = function(userData) {
    var hashed = authenticator.encrypt(userData.password);

    return User.create({
        username: userData.username,
        password: hashed,
        firstname: '',
        lastname: '',
        city: '',
        country: '',
        school: '',
        courses: '',
        generalDescription: '',
        helpDescription: '',
        dateOfBirth: null
    });
};

UserDB.prototype.createUserProfile = function(userData) {
    return User.update({
        firstname: userData.firstname,
        lastname: userData.lastname,
        city: userData.city,
        country: userData.country,
        school: userData.school,
        courses: userData.courses,
        generalDescription: userData.generalDescription,
        helpDescription: userData.helpDescription,
        dateOfBirth: userData.dateOfBirth
    },
    {
        where: { username: userData.username}
    });
};

UserDB.prototype.setTheme = function (userID, theme) {
    return User.update({
        theme: theme
    },
    {
        where: { id: userID }
    });
};

UserDB.prototype.getTheme = function (userID) {
    return User.findOne({
        attributes: ['theme'],

        where: {
            id: userID
        }
    });
};

UserDB.prototype.getRandom = function(currUserID) {
    return UserMatchDAO.getPreviouslyRatedIds(currUserID).then(function(prevRatedUsers) {
        var idCondition;
        if(prevRatedUsers.length == 0) {
            idCondition = {
                $ne: currUserID
            };
        } else {
            idCondition = {
                $ne: currUserID,
                $notIn: prevRatedUsers
            };
        }
        return User.findAll({
                where: {
                    id: idCondition
                }
            }).then(function(users){
                return users[Math.floor(Math.random() * users.length)];
        });
    });
};

UserDB.prototype.getRandomBatch = function(currUserID, size) {
    return UserMatchDAO.getPreviouslyRatedIds(currUserID).then(function(prevRatedUsers) {
        var idCondition;
        if(prevRatedUsers.length == 0) {
            idCondition = {
                $ne: currUserID
            };
        } else {
            idCondition = {
                $ne: currUserID,
                $notIn: prevRatedUsers
            };
        }
        return User.findAll({
                where: {
                    id: idCondition
                }
            }).then(function(users){
                if (users.length <= size) {
                    return users;
                }
                var startPos = Math.floor(Math.random() * (users.length - size));
                return users.slice(startPos, startPos + size);
        });
    });
};

UserDB.prototype.removeUser = function(userId) {
    return User.destroy({
        where: {
            id: userId
        }
    });
};

module.exports = UserDB;