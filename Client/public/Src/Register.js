$(document).ready(function () {
  $("#registerBtn").click( function () {
    const username = $('#username').val();
    const email = $('#email').val();
    const password = $('#password').val();

    const data = {
      username,
      email,
      password
    };
    console.log(data);

    $.ajax({
      type: "POST",
      url: '/api/v1/users/new',
      data,
      success: function (serverResponse) {
        if (serverResponse) {
          alert("Registered");
          console.log("got to dahsboard")
          location.href = '/login';
        }
      },
      error: function (errorResponse) {
        if (errorResponse) {
          alert(`Register error: ${errorResponse.responseText}`);
        }
      }
    });
  });
});
