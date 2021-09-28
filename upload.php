<?php
$user = $_COOKIE['user'];
$pw = $_COOKIE['pw'];
$dt = $_POST['dt'];
$conn = new mysqli('server204.web-hosting.com', 
'joshgncd_joshua', 'hn%X=FbWIU]J', 'joshgncd_riverbank', 3306);
if ($conn->connect_error) {
die('Connection failed: ' . $conn->connect_error);
}
$sql = 'UPDATE users 
SET dt = ' . $dt . '
WHERE user = "' . $user . '" AND pw = "' . $pw . '";';
$conn->query($sql);
echo $dt;
$conn->close();
?>