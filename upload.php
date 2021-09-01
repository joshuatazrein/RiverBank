<?php
$cookie = $_COOKIE['username'];
$file = fopen('users/' . $cookie . '.json', 'w');
fwrite($file, $_REQUEST['data']);
fclose($file);
?>