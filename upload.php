<?php
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
$cookie = $_COOKIE['username'];
echo move_uploaded_file(
  $_FILES["upfile"]["tmp_name"], 
  'users/' . $cookie . '.json'
) ? "OK" : "ERROR UPLOADING";