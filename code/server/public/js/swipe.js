$(function() {
    getNewUser();
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
    $("#location").html(toTitleCase(data.school));
    // $('#userFullName').html(toTitleCase(data['results'][0]['user']['name']['first'] + ' ' + data['results'][0]['user']['name']['last']));
    // $('#gender').html(toTitleCase(data['results'][0]['user']['gender']));
    // $('#location').html(toTitleCase(data['results'][0]['user']['location']['city'] + ', ' + data['results'][0]['user']['location']['state']));
}

// Capitalizes the first letter of each word
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function getNewUser() {
    // Have to append random numbers at the end of URI to force img refresh
    $('#userImage').attr('src', 'http://thecatapi.com/api/images/get?format=src&type=jpg&size=small' + Math.random());

    $.ajax({
        url: '/api/randomUser',
        dataType: 'json',
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
        type: "POST",
        dataType: 'json',
        data: postData
    });
}
