<?php
session_start();

if (isset($_SESSION['email'])) {
    // Echo the email value as JavaScript code
    // echo '<script>var useremail = "' . $_SESSION['email'] . '";</script>';
} else {
    // Redirect to login.php if the user is not authenticated
    header('Location: login.php');
    exit(); // Terminate script execution here
}

if(isset($_GET['action']) && $_GET['action'] == 'logout') {
    logout();
}

function logout() {
    #set SESSION cookie to expire ==> delete cookie
    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(),'',time()-3600, '/');
    }
    session_unset();
    session_destroy();
    #Set redirection
    header('location: login.php');
    exit(); // Terminate script execution here
}

echo '<script>var useremail = "' . $_SESSION['email'] . '";</script>';
?>

<!DOCTYPE html>
<html>
<head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Assignment Three</title>
        <link rel="stylesheet" type="text/css" href="chat.css">
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="chat.js" ></script>
</head>
<body>
    <h1>A Simple Chatroom Service</h1>
    <button id="Logout" value="Logout"><a href="?action=logout">Logout</a></button>
    <div class="message-container">
    
        <div id="" class="message-window">
            <!-- Display chat messages here -->
        </div>
        <div>
            <textarea id="message-input" placeholder="Enter your message"></textarea>
            <button id="send-button">SEND</button>
        </div>
    </div>
    
</body>
</html>