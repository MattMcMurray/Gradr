$(function() {
    getNewUser();
});

$('#likeButton').click(function(e) {
    e.preventDefault();
    console.log('LIKED');
    getNewUser();
});

$('#dislikeButton').click(function(e) {
    e.preventDefault();
    getNewUser();
});

var userCallback = function(data) {
    $('#userFullName').html(toTitleCase(data['results'][0]['user']['name']['first'] + ' ' + data['results'][0]['user']['name']['last']));
    $('#gender').html(toTitleCase(data['results'][0]['user']['gender']));
    $('#location').html(toTitleCase(data['results'][0]['user']['location']['city'] + ', ' + data['results'][0]['user']['location']['state']));
}

// Capitalizes the first letter of each word
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function getNewUser() {
    // Have to append random numbers at the end of URI to force img refresh
    $('#userImage').attr('src', 'http://thecatapi.com/api/images/get?format=src&type=jpg&' + Math.random());

    $.ajax({
        url: 'https://randomuser.me/api/',
        dataType: 'json',
        success: userCallback
    });
}
