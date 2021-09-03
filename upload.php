<?php
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
$cookie = $_COOKIE['username'];
$data = $_POST;
// file_put_contents('users/' . $cookie . '.json', $data);
echo $_POST;
?>

// echo move_uploaded_file(
//   $_FILES["upfile"]["tmp_name"], 
//   'users/' . $cookie . '.json'
// ) ? "OK" : "ERROR UPLOADING";