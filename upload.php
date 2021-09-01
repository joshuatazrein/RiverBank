<?php
header("Access-Control-Allow-Headers: Origin, X-Requested-With, " . 
"Content-Type, Accept, Cache-Control");
$cookie = $_COOKIE['username'];
$file = fopen('users/' . $cookie . '.json', 'w');
fwrite($file, $_POST['data']);
fclose($file)
?>