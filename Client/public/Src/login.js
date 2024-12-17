 $(document).ready( $(function(){
      $("#loginBtn").click(function(){
        const email = $("#email").val().trim()
        const password = $("#password").val().trim()
        console.log("Email:", email); // Debugging
        console.log("Password:", password); // Debugging
        $.ajax({
          url: 'http://localhost:3000/api/v1/user/login',
          method: 'POST',
          data: JSON.stringify({
            email: email,
            password: password
          }),
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
        })
      })
    })
)