var UserInterface = require('../interfaces/UserInterface.js');
var authenticator = require('../mixins/authenticator.js');

var userList, user1, user2, user3;

function UserStub() {
    user1 = {
        username: 'bairosns',
        password: 'wlkslkjaiusddhf7yq98pyrh43hh', //Not actually a password, mashed the keyboard
        school: 'University of Manitoba',
        generalDescription: 'Hi I love homework',
        firstname: 'steve',
        lastname: 'bairosns',
        id: 111,
        theme: 2,
    };

    user2 = {
        username: 'mattmcmurray',
        password: ';lkjsda;ljifsd;jlfsd;ljksda;jlkdsa', //Not actually a password, mashed the keyboard
        school: 'University of Manitoba',
        generalDescription: 'I like doing schoolwork',
        id: 222,
        firstname: 'matt',
        lastname: 'mcmurray',
        theme: 1,
    };

    user3 = {
        username: 'calebmueller',
        password: 'fjefienfuerliuwhrlkjwehrl23h333333',
        school: 'University of Winnipeg',
        generalDescription: 'I hate everyone',
        firstname: 'caleb',
        lastname: 'mueller',
        id: 333
    };

    userList = [];
    userList.push(user1);
    userList.push(user2);
    userList.push(user3);
}

UserStub.prototype = new UserInterface();
UserStub.prototype.constructor = UserStub;

UserStub.prototype.getUser = function(username) {
    found = findUser('username', username);
    prom = new Promise(function(resolve, reject) {
        newUser = {
            dataValues: found,
        };
        resolve(newUser);
    });

    return prom;
};

UserStub.prototype.getUsersById = function(userIDs) {
    var results = [];
    for (var i = 0; i < userIDs.length; i++) {
        var found = findUser('id', userIDs[i])
        if (found)
            results.push(found);
    }

    return new Promise(function(resolve, reject) {
        /*users = {
            dataValues: results
        };*/

        resolve(results);
    });
};

UserStub.prototype.getAllUsers = function() {
    return new Promise(function(resolve, reject) {
        users = {
            dataValues: userList,
        };

        resolve(users);
    });
};

UserStub.prototype.createUser = function(credentials) {
    found = findUser('username', credentials.username);
    if (found) {
        return new Promise(function(resolve, reject) {
            reject(credentials);
        });
    }
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
};

UserStub.prototype.createUserProfile = function(userData) {
    var user = findUser('username', userData.username);
    user.firstname = userData.firstname;
    user.lastname = userData.lastname;
    user.city = userData.city;
    user.country = userData.country;
    user.school = userData.school;
    user.courses = userData.courses;
    user.generalDescription = userData.generalDescription;
    user.helpDescription = userData.helpDescription;
    user.dateOfBirth = userData.dateOfBirth;
};

UserStub.prototype.getRandom = function(currUserID) {
    //achieves expectable results for unit tests
    //it is a stub, after all
    return new Promise(function(resolve, reject) {
        if (currUserID == 111) {
            rand = 2;
        } 
        else {
            rand = 1;
        }

        users = {
            dataValues: userList[rand],
        };

        resolve(users);
    });
};

UserStub.prototype.getRandomBatch = function(currUserID, size) {
    var result;
    if (currUserID == 111) {
        var test = userList.slice(1,4);
        result = test;
    } else {
        result = userList;
    }
    return new Promise(function(resolve, reject) {
        resolve(result);
    });
}

UserStub.prototype.removeUser = function(userID) {
    var removed = null;
    for (var i = 0; i < userList.length; i++) {
        if (userList[i].id === userID) {
            removed = userList[i];
            userList.splice(i, 1);
            break;
        }
    }
    return new Promise(function(resolve, reject) {
        resolve(removed);
    });
};

UserStub.prototype.getTheme = function(userID) {
    var user = findUser('id', userID);
    result = {
        dataValues: {
            theme: user.theme
        }
    }
    return new Promise(function(resolve, reject) {
        resolve(result);
    });
}

UserStub.prototype.setTheme = function(userID, theme) {
    var user = findUser('id', userID);
    user.theme = theme;
    return new Promise(function(resolve, reject) {
        resolve(theme);
    });
}

module.exports = UserStub;

/* Helper functions */
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