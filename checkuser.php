<?php
$username = $_POST['usertest'];
$conn = new mysqli('server204.web-hosting.com', 
  'joshgncd_joshua', 'hn%X=FbWIU]J', 'joshgncd_riverbank', 3306);
if ($conn->connect_error) {
  die('Connection failed: ' . $conn->connect_error);
}
$sql = 'SELECT dt FROM users WHERE user="' . 
  $username . '"';
$result = $conn->query($sql);
if ($result->num_rows == 0) {
  echo 'OK';
} else {
  echo 'FAIL';
}
$conn->close();
?>