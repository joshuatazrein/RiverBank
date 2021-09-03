<?php
$servername = 'server204.web-hosting.com';
$database = 'joshgncd_riverbank';
$username = 'joshcnd_joshua';
$password = 'R1v3rB4nk!';
$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
  die('Connection failed: ' . $conn->connect_error);
}
echo 'Connected successfully';
?>