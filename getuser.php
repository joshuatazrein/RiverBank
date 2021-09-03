<?php
$username = $_POST['usertest'];
$password = $_POST['pwtest'];
$conn = new mysqli('server204.web-hosting.com', 
  'joshgncd_joshua', 'hn%X=FbWIU]J', 'joshgncd_riverbank', 3306);
if ($conn->connect_error) {
  die('Connection failed: ' . $conn->connect_error);
}
mysqli_real_query($conn, 
'SELECT fname
FROM users
WHERE user="' . $username . '" AND ' . 'pw="' . $password . '"');
$result = mysqli_use_result($conn);
echo json_encode(mysqli_fetch_all($result));
?>