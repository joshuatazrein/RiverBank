<?php
// original
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
$cookie = $_COOKIE['fname'];
echo file_get_contents('users/' . $cookie . '.json');
$conn->close();
?>