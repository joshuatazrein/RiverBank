<?php
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
$cookie = $_COOKIE['fname'];
$setting = $_POST['setting'];
$datachange = $_POST['datachange'];
$dataobj = json_decode(file_get_contents('users/' . $cookie . '.json'));
$dataobj->$setting = $datachange;
file_put_contents('users/' . $cookie . '.json', json_encode($dataobj));
echo $dataobj;
?>