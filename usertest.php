<?php
$servername = 'server204.web-hosting.com';
$database = 'joshgncd_riverbank';
$username = 'joshgcnd_joshua';
$password = 'R1v3rB4nk!';
$conn = new mysqli($servername, $username, $password, $database, 3306);
if ($conn->connect_error) {
  die('Connection failed: ' . $conn->connect_error);
}
echo 'Connected successfully';
?>