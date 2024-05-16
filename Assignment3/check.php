<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST'){

    $email = $_POST['email'];
    $conn = mysqli_connect("mydb","dummy","c3322b");
    mysqli_select_db($conn,"db3322") or die( "Unable to select database");

    // $query1 = "SELECT * FROM account WHERE email = '$email' AND password = '$password';";
    $query2 = "SELECT * FROM account WHERE email = '$email';";
    // $result1 = mysqli_query($conn, $query1) or die("Query Error!".mysqli_error($conn));
    $result2 = mysqli_query($conn, $query2) or die("Query Error!".mysqli_error($conn));
    if (mysqli_num_rows($result2) > 0) {
        mysqli_close($conn);
        echo json_encode(['success' => true]);
    } else {
        // User does not exist
        mysqli_close($conn);
        echo json_encode(['success' => false]);
    }
}


