<?php
$username = $_POST['usertest'];
$password = $_POST['pwtest'];
$conn = new mysqli('server204.web-hosting.com', 
  'joshgncd_joshua', 'hn%X=FbWIU]J', 'joshgncd_riverbank', 3306);
if ($conn->connect_error) {
  die('Connection failed: ' . $conn->connect_error);
}
$sql1 = 'INSERT INTO users (user, pw)
VALUES ("' . $username . '", "' . $password . '")';
$conn->query($sql1);
$sql2 = 'SELECT * FROM users WHERE user="' . 
$username . '"';
$result = $conn->query($sql2);
while ($row = $result->fetch_assoc()) {
  echo $row["fname"];
}
$conn->close();
?>