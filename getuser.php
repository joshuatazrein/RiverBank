<?php
$username = $_POST['usertest'];
$password = $_POST['pwtest'];
$conn = new mysqli('server204.web-hosting.com', 
  'joshgncd_joshua', 'hn%X=FbWIU]J', 'joshgncd_riverbank', 3306);
if ($conn->connect_error) {
  die('Connection failed: ' . $conn->connect_error);
}
$sql = 'SELECT fname WHERE user="' . $username . 
  '" AND pw="' . $password . '"';
echo('SELECT fname WHERE user="' . $username . 
'" AND pw="' . $password . '"');
$result = $conn->query($sql);
$row = $result->fetch_array(MYSQLI_NUM);
// print($row[0][0]);
?>