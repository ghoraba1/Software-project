$(document).ready(function(){
    $("#loginBtn").on("click", function() {
      const email = $('#email').val();
      const password = $('#password').val();

      const data = {
        email,
        password
      };
      console.log(data);

      $.ajax({
        type: "POST",
        url: '/api/v1/user/login',
        data  ,
        success: function(serverResponse) {
          if(serverResponse) {
            alert("login successfully");
            console.log("got to dahsboard")
            location.href = '/equipmentmangement';
          }
        },
        error: function(errorResponse) {
          if(errorResponse) {
            alert(`User login error: ${errorResponse.responseText}`);
          }            
        }
      });
    });
  });
