$(document).ready(function() {
    $('#matchesLink').attr('href', '/matches?user=' + sessionStorage.getItem('user_id'));
    $('#rejectionsLink').attr('href', '/rejections?user=' + sessionStorage.getItem('user_id'));
    $('a[href^="' + this.location.pathname + '"]').addClass('active');
});