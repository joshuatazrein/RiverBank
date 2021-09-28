<?php
$user = $_COOKIE['user'];
$pw = $_COOKIE['pw'];
$dt = $_POST['dt'];
$conn = new mysqli('server204.web-hosting.com', 
'joshgncd_joshua', 'hn%X=FbWIU]J', 'joshgncd_riverbank', 3306);
if ($conn->connect_error) {
die('Connection failed: ' . $conn->connect_error);
}
$sql = 'INSERT INTO users (user, pw, dt)
VALUES ("' . $user . '", "' . $pw . '", "' . $dt . '")';
$conn->query($sql);
echo $dt;
$conn->close();
//original
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
$cookie = $_COOKIE['fname'];
$data = $_POST['datastr'];
file_put_contents('users/' . $cookie . '.json', $data);
echo file_get_contents('users/' . $cookie . '.json');
?>