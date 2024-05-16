<?php

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Extract the message data
    $message = $_POST['message'];
    $person = $_POST['person'];
    $time = $_POST['time'];

    // Save the message to the database or any other storage
    $conn = mysqli_connect("mydb","dummy","c3322b");
    mysqli_select_db($conn,"db3322") or die( "Unable to select database");
    $query = "INSERT INTO message (time, message, person) VALUES ('$time', '$message', '$person')";
    $result = mysqli_query($conn, $query) or die("Query Error!".mysqli_error($conn));
    if ($result) {
        mysqli_close($conn);
    }

    // Return a response to the client
    echo json_encode(['success' => true]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch the messages from the database

    $conn = mysqli_connect("mydb","dummy","c3322b");
    mysqli_select_db($conn,"db3322") or die( "Unable to select database");

    $query = "SELECT * 
              FROM message 
              WHERE time >= DATE_SUB(NOW(), INTERVAL 1 HOUR) 
              ORDER BY time ASC";
    $result = mysqli_query($conn, $query) or die("Query Error!".mysqli_error($conn));
    $messages = [];
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $messages[] = $row;
        }
    }
    mysqli_close($conn);

    // Return the messages as JSON response
    echo json_encode(['messages' => $messages]);
} else {
    // Invalid request method
    http_response_code(405);
    echo 'Invalid request method';
}

// Check if the user has been idle for 120 seconds
if (isset($_SESSION['last_activity']) && time() - $_SESSION['last_activity'] > 120) {
    // Clear all session variables
    $_SESSION = array();
    // Destroy the session
    session_destroy();
    // Return a 401 status response
    http_response_code(401);
    echo 'Session expired. Please login again.';
    exit;
}

// Update the last activity time
$_SESSION['last_activity'] = time();        