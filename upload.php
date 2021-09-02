<?php
$cookie = $_COOKIE['username'];
fopen('users/' . $cookie . '.json', 'w');
fwrite($_POST['data']);
close();
?>