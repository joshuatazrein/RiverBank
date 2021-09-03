<?php
$username = $_POST['usertest'];
$password = $_POST['pwtest'];
$conn = new mysqli('server204.web-hosting.com', 
  'joshgncd_joshua', 'hn%X=FbWIU]J', 'joshgncd_riverbank', 3306);
if ($conn->connect_error) {
  die('Connection failed: ' . $conn->connect_error);
}
mysqli_query($conn, 
'INSERT INTO users (user, pw)
VALUES (usertest, pwtest)')
?>