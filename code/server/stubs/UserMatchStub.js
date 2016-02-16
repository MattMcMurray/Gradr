var UserMatchInterface = require('../interfaces/UserMatchInterface.js');

var userMatches, users;

function UserMatchStub() {
    userMatches = [];

    userMatches.push({liker_id: 111, likee_id: 222, likes: true});
    userMatches.push({liker_id: 222, likee_id: 111, likes: true});
    userMatches.push({liker_id: 222, likee_id: 333, likes: true});
    userMatches.push({liker_id: 333, likee_id: 222, likes: false});
    userMatches.push({liker_id: 444, likee_id: 111, likes: true});
    userMatches.push({liker_id: 555, likee_id: 111, likes: false});

    users = [111, 222, 333, 444, 555];
}

UserMatchStub.prototype = new UserMatchInterface();
UserMatchStub.prototype.constructor = UserMatchStub;

UserMatchStub.prototype.addUserMatch = function(liker_id, likee_id, likes) {
    var res = getMatch(liker_id, likee_id, likes);
    var returnValue;

    if (!res && Number.isInteger(liker_id) && Number.isInteger(likee_id) && users.indexOf(liker_id) >= 0 && users.indexOf(likee_id) >= 0) {
        var match = {
            liker_id: liker_id,
            likee_id: likee_id,
            likes: likes
        };
        userMatches.push(match);

        returnValue = match;
    }
    else {
        returnValue = { 
            error: {
                name: 'UserMatchesError',
                message: 'Unable to save UserMatch for users ' + liker_id + ' and ' + likee_id 
            }
        };
    }

    return new Promise(function(resolve) {
        resolve(returnValue);
    });
};

UserMatchStub.prototype.getMatches = function(userId) {
    var potentialPartners = [];
    for (var i = 0; i < userMatches.length; i++) {
        if (userMatches[i].likee_id == userId && userMatches[i].likes == true) {
            potentialPartners.push(userMatches[i].liker_id);
        }
    }
    //Now we have a list of people who liked userId

    //Isn't this the EXACT reason why databases were invented?!?!?!?!
    var ids = [];
    for (var i = 0; i < userMatches.length; i++) {
        if (userMatches[i].liker_id == userId && userMatches[i].likes == true) {
            for (var j = 0; j < potentialPartners.length; j++) {
                if (userMatches[i].likee_id == potentialPartners[j]) {
                    ids.push(potentialPartners[j]);
                    break;
                }
            }
        }
    }

    return new Promise(function(resolve, reject) {
        var matches = {users: ids};
        resolve(ids);
    });
};

UserMatchStub.prototype.getPreviouslyRatedIds = function(userID) {
    var matches = [];
    for (var i = 0; i <userMatches.length; i++) {
        if (userMatches[i].liker_id == userID) {
            matches.push(userMatches[i].likee_id);
        }
    }

    return new Promise(function(resolve, reject) {
        resolve(matches);
    });
};

UserMatchStub.prototype.removeUser = function(userID) {
    var ids = [];

    for (var i = 0; i < userMatches.length; i++) {
        if (userMatches[i].likee_id === userID || userMatches[i].liker_id === userID) {
            ids.push(i);
        }
    }

    for (var i = ids.length - 1; i >= 0; i--) {
        userMatches.splice(ids[i], 1);
    }

    return new Promise(function(resolve, reject) {
        resolve(ids);
    });
};

//Helper function
function getMatch(liker_id, likee_id) {
    for (var i = 0; i < userMatches.length; i++) {
        if (userMatches[i].liker_id == liker_id && userMatches[i].likee_id == likee_id) {
            return {match: userMatches[i], ind: i};
        }
    }
    return null;
}


module.exports = UserMatchStub;