var getUrl = window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[0];

$(function() {
    getNewUser();

    // Super secure security :D
    var username = sessionStorage.getItem('username');
    var user_id = sessionStorage.getItem('user_id');

    

    if (!username || !user_id) {
        location.replace('/');
    }

});


$('#likeButton').click(function(e) {
    e.preventDefault();
    setUserMatch(sessionStorage.user_id, $('#userID').val(), true);
    getNewUser();
});

$('#dislikeButton').click(function(e) {
    e.preventDefault();
    setUserMatch(sessionStorage.user_id, $('#userID').val(), false);
    getNewUser();
});

var userCallback = function(data) {
    $('#userFullName').html(toTitleCase(data.username));
    $('#userID').val(data.userID);
    $('#location').html(toTitleCase(data.school));
    $('#firstName').html(toTitleCase(data.firstname));
    $('#lastName').html(toTitleCase(data.lastname));
    $('#helpDescript').html(toTitleCase(data.helpDescription));
    $('#userImage').attr('src', data.picture);
    if (data.picture == '') {
        $('#userImage').attr('src', baseUrl + 'api/profilePicPlaceholder');
    }
}

// Capitalizes the first letter of each word
function toTitleCase(str) {
    if(str != null)
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    else
        return str;
}

function getNewUser() {
    postData = {
        currUserId: sessionStorage.getItem('user_id')
    };
    $.ajax({
        url: '/api/randomUser',
        dataType: 'json',
        data: postData,
        success: userCallback
    });
}

function setUserMatch(_liker_id, _likee_id, _likes) {
    var postUrl = '/api/' + ((_likes) ? 'likeUser' : 'dislikeUser');
    var postData = {
        liker_id: _liker_id,
        likee_id: _likee_id
    }

    $.ajax({
        url: postUrl,
        type: 'POST',
        dataType: 'json',
        data: postData
    });
}

$('#logout').on('click', function() {
    sessionStorage.clear();
});

$('#home').attr('href', '/main');


module.exports = {
    toTitleCase,
    getNewUser
}
