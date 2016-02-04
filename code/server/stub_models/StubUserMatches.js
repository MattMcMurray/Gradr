var userMatches = [];
userMatches.push({liker_id: 111, likee_id: 222, likes: true});
userMatches.push({liker_id: 222, likee_id: 111, likes: true});
userMatches.push({liker_id: 222, likee_id: 333, likes: true});
userMatches.push({liker_id: 333, likee_id: 222, likes: false});
userMatches.push({liker_id: 444, likee_id: 111, likes: true});
userMatches.push({liker_id: 555, likee_id: 111, likes: false});


//Internal function
function getMatch(liker_id, likee_id) {
    for (var i = 0; i < userMatches.length; i++) {
        if (userMatches[i].liker_id == liker_id && userMatches[i].likee_id == likee_id) {
            return {match: userMatches[i], ind: i};
        }
    }
    return null;
}

var addUserMatch = function(_liker_id, _likee_id, _likes) {
    var res = getMatch(_liker_id, _likee_id, _likes);
    if (res) {
        res.match.likes = _likes;
        userMatches[res.ind] = res.match;
    } else {
        var match = {
            liker_id: _liker_id,
            likee_id: _likee_id,
            likes: _likes
        };
        userMatches.push(match);
    }
};

var getMatches = function(userId) {
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
}

module.exports = {
    addUserMatch: addUserMatch,
    getMatches: getMatches
};