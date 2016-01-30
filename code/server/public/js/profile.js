$('#profileButton').click(function(e) {
    e.preventDefault();
});

$(function() {
    getUser(sessionStorage.getItem('username'));
});

function getUser(username) {
    $.ajax({
        type: 'GET',
        url: '/api/user?username=' + username,
        success: userCallback
    });
}

var userCallback = function(data) {
    $('#firstnameData').html(data.firstname);
    $("#lastnameData").html(data.lastname);
    $("#cityData").html(data.city);
    $("#countryData").html(data.country);
    $("#schoolData").html(data.school);
    $("#coursesData").html(data.courses);
    $("#generalDescriptionData").html(data.generalDescription);
    $("#helpDescriptionData").html(data.helpDescription);
    $("#dateOfBirthData").html(data.dateOfBirth);
}