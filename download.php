<?php
// $user = $_COOKIE['user'];
// $pw = $_COOKIE['pw'];
// $conn = new mysqli('server204.web-hosting.com', 
//   'joshgncd_joshua', 'hn%X=FbWIU]J', 'joshgncd_riverbank', 3306);
// if ($conn->connect_error) {
//   die('FAIL');
// }
// $sql = 'SELECT dt FROM users WHERE user="' . 
//   $username . '" AND pw="' . $password . '"';
// $result = $conn->query($sql);
// if ($result->num_rows > 0) {
//   // output data of each row
//   while ($row = $result->fetch_assoc()) {
//     // echo $row["dt"];
//   }
// } else {
//   // echo "FAIL";
// }
// $conn->close();
// original
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
$cookie = $_COOKIE['fname'];
echo file_get_contents('users/' . $cookie . '.json');
?>