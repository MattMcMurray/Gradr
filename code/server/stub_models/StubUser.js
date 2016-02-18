var authenticator = require('../mixins/authenticator.js');
var StubUserMatches = require('./StubUserMatches.js');

var user1 = {
    username: 'bairosns',
    password: 'wlkslkjaiusddhf7yq98pyrh43hh', //Not actually a password, mashed the keyboard
    school: 'University of Manitoba',
    generalDescription: 'Hi I love homework',
    firstname: 'steve',
    lastname: 'bairosns',
    id: 111,
}

var user2 = {
    username: 'mattmcmurray',
    password: ';lkjsda;ljifsd;jlfsd;ljksda;jlkdsa', //Not actually a password, mashed the keyboard
    school: 'University of Manitoba',
    generalDescription: 'I like doing schoolwork',
    id: 222,
    firstname: 'matt',
    lastname: 'mcmurray',
}

var user3 = {
    username: 'calebmueller',
    password: 'fjefienfuerliuwhrlkjwehrl23h333333',
    school: 'University of Winnipeg',
    generalDescription: 'I hate everyone',
    firstname: 'caleb',
    lastname: 'mueller',
    id: 333
}

var userList = [];
userList.push(user1);
userList.push(user2);
userList.push(user3);

//This is an internal function.
function findUser(field, value) {
    for (var i = 0; i < userList.length; i++) {
        if (value == userList[i][field]) {
            return userList[i];
        }
    }
    return null;
}

function replaceUser(field, value, user) {
    for (var i = 0; i < userList.length; i++) {
        if (value == userList[i][field]) {
            userList[i] = user;
            return true;
        }
    }
    return false;
}

function getUser(username) {
    found = findUser('username', username);
    prom = new Promise(function(resolve, reject) {
        newUser = {
            dataValues: found,
        };
        resolve(newUser);
    });
    return prom;
}

var getUsersById = function(ids) {
    var results = [];
    for (var i = 0; i < ids.length; i++) {
        var found = findUser('id', ids[i])
        results.push(found);
    }

    return new Promise(function(resolve, reject) {
        users = {
            dataValues: results
        };
        resolve(results);
    });
}

var getAllUsers = function() {
    return new Promise(function(resolve, reject) {
        users = {
            dataValues: userList,
        };
        resolve(users);
    });
}

var createUser = function(credentials) {
    found = findUser('username', credentials.username);
    if (found)
        return new Promise(function(resolve, reject) {
            reject(credentials);
        });
    else {
        var hashed = authenticator.encrypt(credentials.password);
        var user = {
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
        };
        return new Promise(function(resolve, reject) {
            newUser = {
                dataValues: user,
            };
            resolve(newUser);
        });
    }
}

var createUserProfile = function(data) {
    var user = findUser('username', data.username);
    user.firstname = data.firstname;
    user.lastname = data.lastname;
    user.city = data.city;
    user.country = data.country;
    user.school = data.school;
    user.courses = data.courses;
    user.generalDescription = data.generalDescription;
    user.helpDescription = data.helpDescription;
    user.dateOfBirth = data.dateOfBirth;
}

var getRandom = function(currUserId) {
    //achieves expectable results for unit tests
    //it is a stub, after all
    return new Promise(function(resolve, reject) {
        if (currUserId == 111) {
            rand = 2;
        } else {
            rand = 1;
        }
        users = {
            dataValues: userList[rand],
        };
        resolve(users);
    });
}

module.exports = {
    getUser: getUser,
    getUsersById: getUsersById,
    createUser: createUser,
    getRandom: getRandom,
    getAllUsers: getAllUsers,
    createUserProfile:createUserProfile,
}