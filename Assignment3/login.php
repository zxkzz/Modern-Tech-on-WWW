<?php 
session_start();
start(); 
function start() {
    if(isset($_POST['login'])) { //if is a POST request
        authenticate();
    } else if(isset($_POST['register'])) {
        register();
    } else  {
        // is a GET request
        if (authenticate()) { 
            header('Location: chat.php');  
        } else {
        // default: display the login form
        display_login_form();
        }
    }
}
function display_login_form($msg=''){
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Assignment Three</title>
        <link rel="stylesheet" type="text/css" href="login.css">
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="login.js" ></script>
    </head>
    <body>
    <h1>A Simple Chatroom Service</h1>
    <div id="loginForm" class="loginform">
        <h2>Login to Chatroom</h2>
        <form action="login.php" method="POST" >
            <fieldset name="logininfo">
                <legend>Login</legend>
                <label for="email">Email:</label> 
                <input type="text" name="email" id="email"><br> 
                <label for="password">Password:</label>
                <input type="text" name="password" id="password"><br> 
                <input type="submit" name="login" value="Login" id="loginButton">
            </fieldset>
        </form>
        <p>Click <a href="#" id="registerLink">here</a> to regiter an account</p>
        <p class="error" id="login_error"><?php echo $msg; ?></p>
        <div id="loginnotification" class="error"></div>
    </div>
    
    <div id="registrationForm" class="registrationform">
        <h2>Register an account</h2>
        <form action="login.php" method="POST">
            <fieldset name="registerinfo">
                <legend>Register</legend>
                <label for="email">Email:</label>
                <input type="text" name="email" id="registeremail"><br>
                <label for="password">Password:</label>
                <input type="text" name="password" id="registerpassword"><br>
                <label for="confirm">Confirm:</label>
                <input type="text" name="confirm" id="confirmPassword"><br>
                <input type="submit" name="register" value="Register" id="registerButton">
            </fieldset>
        </form>
        <p>Click <a href="#" id="loginLink">here</a> for login</p>
        <p class="error" id="register_error"><?php echo $msg; ?></p>
        <div id="registernotification" class="error"></div>
    </div>
    </body>
    </html>
    <?php
}
function authenticate() {
    if (isset($_SESSION['email'])) { //if already authenticated
        // Redirect to chat.php
        header('Location: chat.php');
    }
    if (isset($_POST['email']) && isset($_POST['password'])) {
        $email = $_POST['email'];
        $password = $_POST['password'];
        $conn = mysqli_connect("mydb","dummy","c3322b");
        mysqli_select_db($conn,"db3322") or die( "Unable to select database");
        // Perform a database query to check if the user exists
        $query1 = "SELECT * FROM account WHERE email = '$email' AND password = '$password';";
        $query2 = "SELECT * FROM account WHERE email = '$email';";
        $result1 = mysqli_query($conn, $query1) or die("Query Error!".mysqli_error($conn));
        $result2 = mysqli_query($conn, $query2) or die("Query Error!".mysqli_error($conn));

        // Check if any rows are returned
        if (mysqli_num_rows($result1) > 0) {
            // User exists
            $_SESSION['email'] = $email; //Store authenticated variable
            session_write_close(); 
            mysqli_close($conn);
            // Redirect to chat.php
            header('Location: chat.php');
        } else if (mysqli_num_rows($result2) > 0) {
            // Password is incorrect
            mysqli_close($conn);
            display_login_form("Failed to login: Incorrect password!!");
        } else {
            // User does not exist
            mysqli_close($conn);
            display_login_form("Failed to login: Unknown users!!");
        }
    }
}

function register() {
    if (isset($_POST['email']) && isset($_POST['password'])) {
        $email = $_POST['email'];
        $password = $_POST['password'];
        $confirm = $_POST['confirm'];
        function user_exists($email) {
            $conn = mysqli_connect("mydb","dummy","c3322b");
            mysqli_select_db($conn,"db3322") or die( "Unable to select database");
            // Perform a database query to check if the user exists
            $query = "SELECT * FROM account WHERE email = '$email';";
            $result = mysqli_query($conn, $query) or die("Query Error!".mysqli_error($conn));
            if (mysqli_num_rows($result) > 0) {
                // User exists
                $_SESSION['email'] = $email;
                return true;
            } else {
                // User does not exist
                return false;
            }
        }
        function register_account($email, $password) {
            $conn = mysqli_connect("mydb","dummy","c3322b");
            mysqli_select_db($conn,"db3322") or die( "Unable to select database");
            // Perform a database query to check if the user exists
            $query = "INSERT INTO account (email, password) VALUES ('$email', '$password')";
            $result = mysqli_query($conn, $query) or die("Query Error!".mysqli_error($conn));
            if ($result) {
                mysqli_close($conn);
                return true;
            } else {
                mysqli_close($conn);
                return false;
            }
        }
        // Check if the email address is already registered
        if (user_exists($email)) {
            display_login_form('Email address already exists.');
        } else if($password != $confirm) {
            display_login_form('Passwords do not match.');
        } else {    
            // Register the new account
            if (register_account($email, $password)) {
                // Redirect to chat.php on successful registration
                $_SESSION['email'] = $email;
                header('Location: chat.php');
                exit;
            } else {
                // Display error message if registration fails
                display_login_form('Failed to register. Please try again later.');
            }
        }        
    }
}
?>
