$('#login-form').on('submit', function(event){
  event.preventDefault();
  
  $.ajax({
    type: 'POST',
    url: '/api/login',
    data: {username: $('#username').val(), password: $('#password').val()},
    success: function(data){
      
      sessionStorage.setItem('username', data.user.username);
      sessionStorage.setItem('user_id', data.user.id);
      sessionStorage.setItem('theme', data.user.theme);
      $('.anonymous').show();

      location.href = data.url;
    

    },
    error: function(data) {
      $('#error').show();
    }
  });
});




if (! sessionStorage.getItem('username') ) {
    $('#home').attr('href', '/');
    $('.anonymous').hide();
}


