
$(document).ready(function () {
  // Handle login button click
  $('#loginBtn').click(function (event) {
    event.preventDefault();
    var email = $('#email').val();
    var password = $('#password').val();

    if (email === '' || password === '') {
      $('#errorMessage').text('Please fill in all fields.');
    } else {
      // Perform login
      $.ajax({
        url: '/api/v1/user/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email: email, password: password }),
        success: function (response) {
          $('#errorMessage').text('Login successful!');
           window.location.href = '/EquipmentMangement';
        },
        error: function (xhr) {
          $('#errorMessage').text(xhr.responseText);
        }
      });
    }
  });

  
  
});
