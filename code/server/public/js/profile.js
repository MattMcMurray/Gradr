$('#profileButton').click(function(e) {
    e.preventDefault();
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

var userCallback = function(data) {
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