var user1 = {
    username: "bairosns",
    password: 'wlkslkjaiusddhf7yq98pyrh43hh', //Not actually a password, mashed the keyboard
    school: 'University of Manitoba',
    generalDescription: 'Hi I love homework',
}

var user2 = {
    username: "mattmcmurray",
    password: ";lkjsda;ljifsd;jlfsd;ljksda;jlkdsa", //Not actually a password, mashed the keyboard
    school: 'University of Manitoba',
    generalDescription: 'I like doing schoolwork',
}

var userList = [];
userList.push(user1);
userList.push(user2);

function findUser(username) {
    for (var i = 0; i < userList.length; i++) {
        if (username == userList[i].username) {
            console.log(userList[i]);
            return userList[i];
        }
    }
    return null;
}

function getUser(username) {
    found = findUser(username);
    prom = new Promise(function(resolve, reject) {
        newUser = {
            dataValues: found,
        }
        resolve(newUser);
    });
    return prom;
}

var getUsersById = function(ids) {
    console.log("In getUsersById");
    // return UserConnection.findAll({
    //     where:{
    //         id: ids
    //     }
    // });
}

var getAllUsers = function() {
    console.log("In getAllUsers");
    // return UserConnection.findAll();
}

var createUser = function(credentials) {
    console.log("In createUser");
    // var hashed = authenticator.encrypt(credentials.password);

    // return UserConnection.create({
    //     username: credentials.username,
    //     password: hashed,
    //             firstname: '',
    //             lastname: '',
    //             city: '',
    //             country: '',
    //             school: '',
    //             courses: '',
    //             generalDescription: '',
    //             helpDescription: '',
    //             dateOfBirth: null
    // });
}

var createUserProfile = function(data) {
    console.log("In createUserProfile");
    // UserConnection.update({
    //     firstname: data.firstname,
    //     lastname: data.lastname,
    //     city: data.city,
    //     country: data.country,
    //     school: data.school,
    //     courses: data.courses,
    //     generalDescription: data.generalDescription,
    //     helpDescription: data.helpDescription,
    //     dateOfBirth: data.dateOfBirth
    // },
    // {
    //     where: { username: data.username}
    // });
}

var getRandom = function() {
    console.log("In getRando");
    // return UserConnection.findAll().then(function(users){
    //     return users[Math.floor(Math.random() * users.length)];var rand = users[Math.floor(Math.random() * users.length)];
    // });
}
// 

module.exports = {
    getUser: getUser,
    getUsersById: getUsersById,
    createUser: createUser,
    getRandom: getRandom,
    getAllUsers: getAllUsers,
    createUserProfile:createUserProfile,
}