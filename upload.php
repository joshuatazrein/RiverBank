<?php
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
$cookie = $_COOKIE['username'];
$data = $_POST['data'];
// file_put_contents('users/' . $cookie . '.json', $data);
echo $_POST['datastr'];
?>