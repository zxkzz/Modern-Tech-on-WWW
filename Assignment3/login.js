switchForms();
function switchForms() {
    $(document).ready(function () {
        // Hide the registration form initially
        $("#registrationForm").hide();

        // Show the registration form when the register link is clicked
        $("#registerLink").click(function () {
            // Clear the input fields
            $("#email").val("");
            $("#password").val("");
            // Hide the login form and show the registration form
            $("#loginForm").hide();
            $("#registrationForm").show();
        });

        // Show the login form when the login link is clicked
        $("#loginLink").click(function () {
            // Clear the input fields
            $("#registeremail").val("");
            $("#registerpassword").val("");
            // Hide the registration form and show the login form
            $("#confirmPassword").val(""); 
            $("#registrationForm").hide();
            $("#loginForm").show();
        });
    });
}   

$(document).ready(function () {

$("#loginForm").submit(function(event) {
    event.preventDefault();   
});
$("#registrationForm").submit(function(event) {
    event.preventDefault();   
});
    
checkloginform();
checkregisterform();

function checkloginform() {
    // Email existence verification
    $("#email").blur(function () {

        //a. Check whether the email address belongs to the @connect.hku.hk, performs the checking once the email input field has lost focus.
        var email = $(this).val();
        var domain = "@connect.hku.hk";
        var isValid = email.endsWith(domain);
        if (!isValid) {
            $("#loginnotification").text("Please enter a valid HKU @connect email adress").show();       
            return;
        } else if (isValid) {
            $("#loginnotification").empty();
        }
        //b.Check whether the email has been registered, performs the checking once the email input field has lost focus. 
        $.ajax({
            url: 'check.php',
            type: "POST",
            data: { email: email },
            dataType: "json",
            success: function (response) {
                console.log('Response:', response);
                if (response.success === false) {
                    console.log('Message sent:', response);
                    $("#loginnotification").text("Cannot find your email record").show();
                } else if(response.success === true) {
                    $("#loginnotification").empty();
                }
            }
        });
    });

    // c.Check whether entered all required information, performs the checking when the user clicks the ‘login’ button.
    $("#loginButton").click(function () {
        var email = $("#email").val();
        var password = $("#password").val();
        if (!email) {
            $("#loginnotification").text("Missing Email address").show();
            return;
        } else if (!password) {
            $("#loginnotification").text("Please provide the password").show();
            return;
        } else if (email && password) {
            $("#loginnotification").empty();
        }
        // Submit the form if all validations pass
        $("#loginForm").unbind("submit").submit();
        window.location.reload(true);
    });
   
}
function checkregisterform() {
    $("#registeremail").blur(function () {

        //a. Check whether the email belongs to the @connect.hku.hk domain, performs the checking once the Email input field has lost focus.
        var email = $(this).val();
        var domain = "@connect.hku.hk";
        var isValid = email.endsWith(domain);
        if (!isValid) {
            console.log('Email:', email);
            $("#registernotification").text("Please enter a valid HKU @connect email adress").show();       
            return;
        } else if (isValid) {
            $("#registernotification").empty();
        }

        //b.Check whether the email has been registered, performs the checking once the email input field has lost focus. 
        $.ajax({
            url: 'check.php',
            type: 'POST',
            data: { email: email },
            dataType: 'json',
            success: function (response) {
                if (response.success === true) {
                    $("#registernotification").text("You have registered before!").show();
                } else if(response.success === false) {
                    $("#registernotification").empty();
                }
            }
        });
    });

    $("#registerButton").click(function () {
        var email = $("#registeremail").val();
        var password = $("#registerpassword").val();
        var confirmPassword = $("#confirmPassword").val();

        //d. Check whether entered all required information, performs the checking when the user clicks the ‘register’ button.
        if (!email) {
            $("#registernotification").text("Missing Email address").show();
            return;
        } else if (!password) {
            $("#registernotification").text("Please provide the password").show();
            return;
        } else if (!confirmPassword) {
            $("#registernotification").text("Please confirm the password").show();
            return;
        } else if (email && password && confirmPassword) {
            $("#registernotification").empty();
        }
        //c. Check whether the two passwords are the same, performs the checking when the user clicks the ‘register’ button. 
        if (password !== confirmPassword) {
            $("#registernotification").text("Mismatch passwords").show();
            return;
        } else if (password === confirmPassword) {  
            $("#registernotification").empty();
        }
        $("#registrationForm").unbind("submit").submit();
        window.location.reload(true);
    });
}

});