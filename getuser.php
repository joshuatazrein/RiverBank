<?php
$username = $_POST['usertest'];
$password = $_POST['pwtest'];
$conn = new mysqli('server204.web-hosting.com', 
  'joshgncd_joshua', 'hn%X=FbWIU]J', 'joshgncd_riverbank', 3306);
if ($conn->connect_error) {
  die('Connection failed: ' . $conn->connect_error);
}
$sql = 'SELECT fname FROM "users" WHERE user="' . 
  $username . '" AND pw="' . $password . '"';
$result = $conn->query($sql);
if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    echo "fname: " . $row["fname"];
  }
} else {
  echo "0 results";
}
$conn->close();
?>