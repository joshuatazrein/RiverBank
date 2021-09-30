<?php
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
$cookie = $_COOKIE['fname'];
$data = $_POST['datastr'];
file_put_contents('users/' . $cookie . '.json', $data);
echo $data;
?>