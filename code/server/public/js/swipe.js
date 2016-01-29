$(function() {
    getNewUser();

    // Super secure security :D
    var username = localStorage.getItem('username');
    var user_id = localStorage.getItem('user_id');

    if (!username || !user_id) {
        location.replace('/');
    } else {
        // TODO get user and verify they exist
    }

});

$('#likeButton').click(function(e) {
    e.preventDefault();
    getNewUser();
});

$('#dislikeButton').click(function(e) {
    e.preventDefault();
    getNewUser();
});

var userCallback = function(data) {
    $('#userFullName').html(toTitleCase(data.username));
    $("#location").html(toTitleCase(data.school));
}

// Capitalizes the first letter of each word
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function getNewUser() {
    // Have to append random numbers at the end of URI to force img refresh
    $('#userImage').attr('src', 'http://thecatapi.com/api/images/get?format=src&type=jpg&' + Math.random());

    $.ajax({
        url: '/api/randomUser',
        dataType: 'json',
        success: userCallback
    });
}
