var Sequelize = require('sequelize');
var connection = require('../database.js').sequelize;
var authenticator = require('../mixins/authenticator.js')
var UserMatches = require('./UserMatches.js')

//IF YOU DARE RENAME ONE OF THESE FIELDS, YOU MUST UPDATE THE EQUIVALENT FIELD IN profile.jade
//IF YOU DON'T KNOW WHAT THIS ENTAILS ASK STEVE, HE KNOWS AND CARES
UserConnection = connection.define('users', {
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
    }
});
//If you get missing column errors, run the commented sync once to rebuild the tables
// UserConnection.sync({force:true})

UserConnection.sync()

var getUser = function(username) {
    return UserConnection.findOne({
        where:{
            username: username
        }
    });
}

var getUsersById = function(ids) {
    return UserConnection.findAll({
        where:{
            id: ids
        }
    });
}

var getAllUsers = function() {
    return UserConnection.findAll();
}

var createUser = function(credentials) {
    var hashed = authenticator.encrypt(credentials.password);

    return UserConnection.create({
        username: credentials.username,
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
}

var createUserProfile = function(data) {
    return UserConnection.update({
        firstname: data.firstname,
        lastname: data.lastname,
        city: data.city,
        country: data.country,
        school: data.school,
        courses: data.courses,
        generalDescription: data.generalDescription,
        helpDescription: data.helpDescription,
        dateOfBirth: data.dateOfBirth
    },
    {
        where: { username: data.username}
    });
}

var getRandom = function(currUserId) {
    return UserMatches.getPreviouslyRatedIds(currUserId).then(function(prevRatedUsers) {
        var idCondition;
        if(prevRatedUsers.length == 0) {
            idCondition = {
                $ne: currUserId
            };
        } else {
            idCondition = {
                $ne: currUserId,
                $notIn: prevRatedUsers
            };
        }
        return UserConnection.findAll({
                where: {
                    id: idCondition
                }
            }).then(function(users){
                return users[Math.floor(Math.random() * users.length)];
        });
    });
}

module.exports = {
    getUser: getUser,
    getUsersById: getUsersById,
    createUser: createUser,
    getRandom: getRandom,
    getAllUsers: getAllUsers,
    createUserProfile:createUserProfile
}