<?php
$cookie = $_COOKIE['username'];
echo fopen('users/' . $cookie . '.json', 'w');
echo fwrite($_POST['data']);
close();
?>