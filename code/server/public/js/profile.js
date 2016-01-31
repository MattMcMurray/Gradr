$('#profileButton').click(function(e) {
    /*e.preventDefault();
    $.ajax({
        type: 'GET',
        url: '/api/getUser?user=' + sessionStorage.getItem('username'),
        success: function(data) {
            console.log(data);
            location.href='/profileUpdate';
        }
    });*/
    console.log(sessionStorage.getItem('username'));
});

$(function() {
    getUser(sessionStorage.getItem('username'));
});

function getUser(username) {
    $.ajax({
        type: 'GET',
        url: '/api/getUser?user=' + username,
        success: userCallback
    });
}

//var user;

var userCallback = function(data) {
    //user = data.user.username;
    $('#usernameData').html(data.user.username);
    $('#firstnameData').html(data.user.firstname);
    $("#lastnameData").html(data.user.lastname);
    $("#cityData").html(data.user.city);
    $("#countryData").html(data.user.country);
    $("#schoolData").html(data.user.school);
    $("#coursesData").html(data.user.courses);
    $("#generalDescriptionData").html(data.user.generalDescription);
    $("#helpDescriptionData").html(data.user.helpDescription);
    $("#dateOfBirthData").html(data.user.dateOfBirth);
}